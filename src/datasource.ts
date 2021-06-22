import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
} from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions, tFetchData } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  resolution: number;
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.resolution = instanceSettings.jsonData.resolution || 1000.0;
  }
  async doRequest(query: MyQuery) {
    const result = await getBackendSrv().fetch<tFetchData>({
      method: 'GET',
      url: 'http://localhost:1998/metrics',
      params: query,
    });

    return result;
  }
  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    // const { range } = options;
    // const from = range!.from.valueOf();
    // const to = range!.to.valueOf();
    // // duration of the time range, in milliseconds.
    // const duration = to - from;
    // // step determines how close in time (ms) the points will be to each other.
    // const step = duration / this.resolution;
    const serverData: tFetchData = [];
    for (let index = 0; index < 1000; index++) {
      const resp = await fetch('http://localhost:1998/metrics', { method: 'GET' });
      const { time, value } = await resp.json();
      serverData.push({ time, value });
    }
    // // Return a constant for each query.
    const data = options.targets.map(target => {
      const { refId } = target;
      const frame = new MutableDataFrame({
        refId,
        fields: [
          {
            name: 'time',
            type: FieldType.time,
          },
          { name: 'value', type: FieldType.number },
        ],
      });
      for (let i = 0; i < serverData.length; i++) {
        const { time, value } = serverData[i];
        frame.add({ time, value });
      }
      return frame;
      //   return new MutableDataFrame({
      //     refId: query.refId,
      //     fields: [
      //       { name: 'Time', values: [from, to], type: FieldType.time },
      //       { name: 'Value', values: [query.constant, query.constant], type: FieldType.number },
      //     ],
      //   });
    });

    return { data };
  }

  async testDatasource() {
    // Implement a health check for your data source.
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
