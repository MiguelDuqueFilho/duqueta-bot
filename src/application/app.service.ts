import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  callback(param: any): any {
    return param;
  }
  callbackPost(body: any): any {
    return body;
  }
}
