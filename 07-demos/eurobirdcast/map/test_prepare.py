"""Observation/map alignment regression guards; no network."""
import unittest
from prepare import reading, make_map

class MapTests(unittest.TestCase):
    def row(self,**changes):
        r=dict(radar='depro',datetime='2017-10-01 22:00:00+00:00',night='True',missing='False',birds_km2='0',bird_u='3',bird_v='-4')
        r.update(changes);return r

    def test_daytime_zero_hidden(self):
        r=reading(self.row(night='False'));self.assertEqual(r['status'],'daytime');self.assertIsNone(r['density']);self.assertIsNone(r['u'])

    def test_night_zero_and_ground_vector_retained(self):
        self.assertEqual(reading(self.row()),{'density':0,'u':3,'v':-4,'status':'observed'})

    def test_missing_never_becomes_zero(self):
        r=reading(self.row(missing='True'));self.assertEqual(r['status'],'missing');self.assertIsNone(r['density'])

    def test_density_and_velocity_independent(self):
        r=reading(self.row(bird_u='nan'));self.assertEqual(r['density'],0);self.assertIsNone(r['u']);self.assertIsNone(r['v'])
        r=reading(self.row(birds_km2='nan'));self.assertIsNone(r['density']);self.assertEqual(r['u'],3)

    def test_fixed_hour_alignment_and_bounds(self):
        static={y:[dict(radar='depro',observed='True',lat='52',lon='13')] for y in (2015,2016,2017)}
        dynamic=[self.row(),self.row(datetime='2017-10-08 00:00:00+00:00')]
        result=make_map(static,dynamic,[])
        self.assertEqual(len(result['times']),168);self.assertEqual(result['times'][-1],'2017-10-07T23:00:00Z')
        rows=result['stations'][0]['readings'];self.assertEqual(rows[22]['status'],'observed');self.assertEqual(rows[21]['status'],'missing')

if __name__=='__main__':unittest.main()
