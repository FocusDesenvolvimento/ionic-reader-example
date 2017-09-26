import { FormControl } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, Content, LoadingController, NavController } from 'ionic-angular';
import { InAppBrowser } from 'ionic-native';

import { RedditServiceProvider } from '../../providers/reddit-service/reddit-service';


import { Http } from '@angular/http'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  @ViewChild(Content) content:Content;
  public feeds : Array<any>
  private url : string = 'https://www.reddit.com/new.json'
  private olderPosts = 'https://www.reddit.com/new.json?after='
  private newerPosts: string = "https://www.reddit.com/new.json?before="
  public noFilter: Array<any>;
  public hasFilter: boolean = false;
  public searchTerm : any;
  public searchTermControl : FormControl;

  constructor(
    public navCtrl: NavController,
    public http: Http,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl : ActionSheetController,
    public redditService: RedditServiceProvider
  ) {

    this.fetchContent()
    this.searchTermControl = new FormControl();
    this.searchTermControl.valueChanges.debounceTime(1000).distinctUntilChanged().subscribe(search => {
      if (search !== '' && search) {
        this.filterItems();
      }
    }) 

  }

  fetchContent(): void {
    let loading = this.loadingCtrl.create({
      content: 'Carregando Novidades...'
    })

    loading.present()
    
    this.redditService.fetchData(this.url).then(data => {
      this.feeds = data;
      this.noFilter = this.feeds;
      loading.dismiss();
    })

  }

  itemSelected(url) : void {
    new InAppBrowser(url, '_system');
  }

  doInfinite(scroll) : void {
    let paramsUrl = (this.feeds.length > 0) ? this.feeds[this.feeds.length - 1]['data'].name : "";
    if (paramsUrl){
      this.redditService.fetchData(this.olderPosts + paramsUrl).then(data => {
      this.feeds = data;
      this.noFilter = this.feeds;
      scroll.complete();
      })
    }
  }  
    
    doRefresh(scroll) : void {
      let paramsUrl = this.feeds[0].data.name;
      
      if (paramsUrl){
        this.redditService.fetchData(this.newerPosts + paramsUrl).then(data => {
          this.feeds = data;
          this.noFilter = this.feeds;
          scroll.complete();
        })
      }
      
    }

    
    
    filterItems() : void {
      this.hasFilter = false;
      this.feeds = this.noFilter.filter((item) => {
        return item.data.title.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
    }
    
    
    showFilters() : void {
      this.content.scrollToTop();
      let actionSheet = this.actionSheetCtrl.create({
        title : 'Opções de Filtro',
        buttons : [{
          text: 'Music',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "music");
            this.hasFilter = true;
          }
        },
        {
          text: 'Movies',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "movies");
            this.hasFilter = true;
          }
        },{
          text: 'Games',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "gaming");
            this.hasFilter = true;
          }
        },
        {
          text: 'Pictures',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "pics");
            this.hasFilter = true;
          }
        },                
        {
          text: 'Ask Reddit',
          handler: () => {
            this.feeds = this.noFilter.filter((item) => item.data.subreddit.toLowerCase() === "askreddit");
            this.hasFilter = true;
          }
        }
        ,{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.feeds = this.noFilter;
            this.hasFilter = false;
          }
        }
        ]
      });
  
      actionSheet.present();
  
    } 
  
    
  }
