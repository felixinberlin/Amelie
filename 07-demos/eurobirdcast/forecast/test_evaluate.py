import unittest
from evaluate import fit, predict, solve, with_lags, evaluate
class ForecastTests(unittest.TestCase):
    def row(self,date,end,y=10):
        return {'date':date,'nightEndUtc':end,'targetBirdsKm2':y,'radarCoverage':1,'weather':[1,2,3,4]}
    def test_whole_interval_must_be_48_hours_old(self):
        rows=[self.row('2023-10-01','2023-10-02T06:00:00Z'),self.row('2023-10-02','2023-10-03T06:00:00Z'),self.row('2023-10-04','2023-10-05T06:00:00Z')]
        result=with_lags(rows)
        self.assertEqual(len(result),1)
        self.assertEqual(result[0]['lagNightEndUtc'],'2023-10-02T06:00:00Z')
    def test_old_or_future_radar_never_fills_missing_lag(self):
        self.assertEqual(with_lags([self.row('2023-10-01','2023-10-02T06:00:00Z'),self.row('2023-10-10','2023-10-11T06:00:00Z')]),[])
    def test_solver_known_system(self):
        self.assertEqual(solve([[2,1],[1,3]],[4,7]),[1,2])
    def test_constant_target_and_features_remain_finite(self):
        rows=[self.row(f'2021-10-{d:02}',f'2021-10-{d+1:02}T06:00:00Z',0) for d in range(1,12)]
        fitted=fit(rows,'weather',10)
        self.assertEqual(predict(fitted,rows[0]),(0,0))
    def test_fit_does_not_mutate_training_or_see_test_values(self):
        rows=[self.row(f'2021-10-{d:02}',f'2021-10-{d+1:02}T06:00:00Z') for d in range(1,12)]
        fitted=fit(rows,'weather',10)
        before=fitted.copy()
        predict(fitted,self.row('2023-10-01','2023-10-02T06:00:00Z',1e10))
        self.assertEqual(fitted,before)
    def test_insufficient_coverage_emits_no_predictions_or_skill(self):
        result=evaluate({'rows':[], 'station':'test','radar':'test','bandM':[1000,2000],
            'target':'birds/km²','sources':[],'excluded':[]})
        self.assertEqual(result['status'],'blocked-data-quality')
        self.assertEqual(result['predictions'],[])
        self.assertEqual(result['metrics'],{})
    def test_held_out_labels_never_change_predictions_or_tuning(self):
        rows=[]
        for year in (2021,2022,2023):
            for day in range(1,30):
                r=self.row(f'{year}-10-{day:02}',f'{year}-10-{day+1:02}T06:00:00Z',day*3)
                r['weather']=[day*.1,day%3,day%4,day%5]
                rows.append(r)
        dataset={'rows':rows,'station':'synthetic','radar':'test','bandM':[1000,2000],
            'target':'birds/km²','sources':[],'excluded':[]}
        first=evaluate(dataset)
        for r in rows:
            if r['date'].startswith('2023'): r['targetBirdsKm2']*=10
        # Changing 2023 labels also changes within-2023 radar lags legitimately.
        # Seasonal/weather predictions and alpha choices must still be unchanged.
        second=evaluate(dataset)
        self.assertEqual(first['tuning'],second['tuning'])
        for a,b in zip(first['predictions'],second['predictions']):
            for model in ('seasonal','weather'):
                self.assertEqual(a['predictedBirdsKm2'][model],b['predictedBirdsKm2'][model])
if __name__=='__main__': unittest.main()
