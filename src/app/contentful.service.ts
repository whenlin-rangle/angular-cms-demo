import { Injectable } from '@angular/core';
import  * as contentful from 'contentful';
import { CONFIG } from 'src/environment/cms-config';

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {

  private client = contentful.createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken,
  });

  constructor() { }

  getAthletes(query?: object): Promise<contentful.Entry<any>[]> {
    return this.client.getEntries(Object.assign({
      content_type: CONFIG.contentTypeIds.athlete
    }, query))
    .then(res => res.items);
  }
}
