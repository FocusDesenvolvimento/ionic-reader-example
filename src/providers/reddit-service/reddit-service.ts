import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the RedditServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RedditServiceProvider {
  
  private feeds: Array<any>;

  constructor(private http: Http) {}

  fetchData(url: string): Promise<any> {
    
    return new Promise((resolve) => {

      this.http.get(url).map(res => res.json())
        .subscribe(data => {
          this.feeds = data.data.children;
          
          this.feeds.forEach((e) => {
            if (!e.data.thumbnail || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
              e.data.thumbnail = 'https://www.kelleysislandchamber.com/wp-content/uploads/2014/11/directory-sample.png';
            }
          })
          resolve(this.feeds);
        }, err => console.log(err));          
    });
  }

}
