"""Scientific masking guards; no network."""
import unittest
from run import eligible_row, evaluate, WEATHER
import copy

class ObservationMaskTests(unittest.TestCase):
    def sample(self,**changes):
        row=dict(radar='depro',night='True',missing='False',birds_km2='0',datetime='2015-09-01 22:00:00+00:00')
        row.update({key:'1' for key in WEATHER});row.update(changes)
        return row

    def test_real_night_zero_is_retained(self):
        row,reason=eligible_row(self.sample(),{'depro'})
        self.assertIsNone(reason);self.assertEqual(row['targetBirdsKm2'],0)

    def test_source_missing_zero_is_not_absence(self):
        row,reason=eligible_row(self.sample(missing='True'),{'depro'})
        self.assertIsNone(row);self.assertEqual(reason,'source-missing')

    def test_daytime_imposed_zero_is_not_night_target(self):
        row,reason=eligible_row(self.sample(night='False'),{'depro'})
        self.assertIsNone(row);self.assertEqual(reason,'daytime')

    def test_nonfinite_weather_excludes_all_model_rows(self):
        row,reason=eligible_row(self.sample(t2m='nan'),{'depro'})
        self.assertIsNone(row);self.assertEqual(reason,'nonfinite-or-negative')

    def test_test_targets_do_not_choose_penalties_and_common_stations(self):
        data={}
        for year in (2015,2016,2017):
            data[year,'static_features.csv']=[{'radar':'depro','observed':'True'}]
            if year==2015:data[year,'static_features.csv'].append({'radar':'extra','observed':'True'})
            data[year,'dynamic_features.csv']=[self.sample(datetime=f'{year}-09-{1+i//24:02d} {i%24:02d}:00:00+00:00',birds_km2=str(i%9),t2m=str(i%7)) for i in range(120)]
        first=evaluate(data,[])
        changed=copy.deepcopy(data)
        for row in changed[2017,'dynamic_features.csv']:row['birds_km2']='1000'
        second=evaluate(changed,[])
        self.assertEqual(first['tuning'],second['tuning'])
        self.assertNotEqual(first['metrics'],second['metrics'])
        self.assertEqual(first['coverage']['stations'],['depro'])
        self.assertEqual(first['coverage']['excludedNonCommonStations']['2015'],['extra'])

if __name__=='__main__':unittest.main()
