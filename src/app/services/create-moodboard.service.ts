import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { AuthenticateService } from './authenticate.service';
import { LocalStorageService } from './local-storage/local-storage.service';


const httpOptions = {
 headers: new HttpHeaders({'Content-Type': 'application/json'}),
  Authorization: 'Bearer 1',
};
@Injectable({
  providedIn: 'root'
})
export class CreateMoodboardService {
  constructor(
    private http: HttpClient,
    private auth: AuthenticateService,
    private ls: LocalStorageService
    ) { }

  getCompanyListByUserMD(user_id){
    return this.http.get<any>(environment.endPoint + 'getcompanyByUserMoodboard?user_id='+ user_id).pipe(map((list:any)=> list.result.map(x=>x.company)));

  }
  createMoodboard(moodboardDetails): Observable <any> {
    return this.http.post<any>(environment.endPoint + 'createMoodBoardNew', moodboardDetails);
  }

  MoodboardTypeList(): Observable<any> {
      return this.http.get<any>(environment.endPoint + 'getMoodBoardType');
  }
  getMoodBoardDetails(moodboardId): Observable<any> {
    return this.http.post<any>(environment.endPoint + 'load/moodboard/items', {moodboard_id: moodboardId});
  }
  addProdsToCart(moodboardId, prodIds, userId): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.post<any>(environment.endPoint + 'add/moodboard/items', {mood_board_id: moodboardId, product_ids : prodIds , user_id: userId});
  }
  addProdsToCart1(moodboardId, prodIds, userId, variationid, prodId, qty, btnType = null, month,other_user_id): Observable<any> {
    // tslint:disable-next-line: max-line-length
    return this.http.post<any>(environment.endPoint + 'add/moodboard/items', {mood_board_id: moodboardId, product_ids : prodIds , user_id: userId, sku: variationid, product_id: prodId, button_type: btnType, quantity: qty,month: month,other_user_id:other_user_id});
  }
  getProjectListMD(id: any){
    return this.http.get<any>(environment.endPoint + 'getProjectListNew?company_id='+ id).pipe(map((list:any)=> list.result));
  }
 

  getMoodboards(companyName,projectName,start,count): Observable<any> {
    // console.log(this.ls.getFromLocal().userId);
    this.ls.getItem('supplier_id');
    console.log('99999');
    return this.http.get<any>(environment.endPoint + 'getMoodBoard?supplier_id=' + this.ls.getItem('supplier_id')+"&company_name="+companyName+'&project_name='+projectName+'&start='+start+'&count='+count);
  }
  getMyMoodboards(companyName?,projectName?,start?,count?): Observable<any> {
    // console.log(this.ls.getFromLocal().userId);
    return this.http.post<any>(environment.endPoint  + 'getMoodBoardByUser', { userid :  this.ls.getFromLocal().userId, company_name : companyName,project_name :projectName,start:start,count:count} );
  }
  getMonthPrice(productId, month): Observable<any> {
    // console.log(this.ls.getFromLocal().userId);
    return this.http.get<any>(environment.endPoint + 'load/rent/price?product_id=' + productId + '&month=' + month);
  }
  saveQuote(obj) {
    return this.http.post<any>(environment.endPoint + 'update/moodboard/items', obj);
  }
  moodboardSingleItem(obj){
    return this.http.post<any>(environment.endPoint + 'update/moodboard/singleitem', obj);
  }
  removeProduct(obj) {
    return this.http.post<any>(environment.endPoint + 'remove/moodboard/items', obj);
  }
  updateMoodBoard(obj) {
    return this.http.post<any>(environment.endPoint + 'updateMoodBoard', obj);
  }
  getImageUrl(url) {
    return this.http.get<any>(environment.endPoint + 'image/convert/base64?img_url=' + url);
  }
  DeleteModdboard(moodboard_id, user_id): Observable<any> {
    // console.log(this.ls.getFromLocal().userId);
    return this.http.get<any>(environment.endPoint + 'disable/moodboard?moodboard_id=' + moodboard_id + '&user_id=' + user_id);
  }
  ActivateModdboard(moodboard_id, user_id): Observable<any> {
    // console.log(this.ls.getFromLocal().userId);
    return this.http.get<any>(environment.endPoint + 'activate/moodboard?moodboard_id=' + moodboard_id + '&user_id=' + user_id);
  }
  getDeletedModdboard(user_id,componyName,projectName,start,count): Observable<any> {
    // console.log(this.ls.getFromLocal().userId);
    return this.http.get<any>(environment.endPoint + 'disable_moodboards?userid=' + user_id+"&company_name="+componyName+'&project_name='+projectName+'&start='+start+'&count='+count);
  }
  moodBoardList(obj) {
    return this.http.post<any>(environment.endPoint + 'update/moodboard/product/type', obj);
  }
  shareMoodboard(obj){
    return this.http.post(
      environment.endPoint + 'shareMoodBoardLink', obj);
  }
  updateMoodboardByPublic(params){
    return this.http.post<any>(environment.endPoint + 'updateMoodboardByPublic', params);
  }
  updateMoodboardByPublicHistory(params,page){
    return this.http.post<any>(environment.endPoint + 'load/moodboard/history', {moodboard_id:params,start:page,count:12});
  }
}
