import { Component } from '@angular/core'
import { NavController, LoadingController } from 'ionic-angular'
import { InAppBrowser } from 'ionic-native';

import { Http } from '@angular/http'
import 'rxjs/add/operator/map'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public feeds : Array<object>
  private url : string = 'https://www.reddit.com/new.json'
  public olderPosts = 'https://www.reddit.com/new.json?after='

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController
  ) {
    this.fetchContent()
  }

  fetchContent(): void {
    let loading = this.loadingCtrl.create({
      content: 'Carregando Novidades'
    })

    loading.present()
    
    this.http
      .get(this.url)
      .map(res => res.json())
      .subscribe(data => {
        this.feeds = data.data.children
        
        this.feeds.forEach((e : any)=>{
          if((!e.data.thumbnail) || e.data.thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ){
            e.data.thumbnail = 'https://www.kelleysislandchamber.com/wp-content/uploads/2014/11/directory-sample.png';
          }
        })

        // Exibindo conteúdo do array no console do browser
        loading.dismiss()
      })
  }

  itemSelected(url) : void {
    new InAppBrowser(url, '_system');
  }

  doInfinite(scroll) : void {
    let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1]['data'].name : "";
    
          this.http.get(this.olderPosts + paramsUrl).map(res => res.json())
            .subscribe(data => {
            
              this.feeds = this.feeds.concat(data.data.children);
              
              this.feeds.forEach((e, i, a) => {
                if (!e['data'].thumbnail || e['data'].thumbnail.indexOf('b.thumbs.redditmedia.com') === -1 ) {  
                  e['data'].thumbnail = 'http://www.redditstatic.com/icon.png';
                }
              })
              scroll.complete();
            }); 
      }  }
