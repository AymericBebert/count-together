import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiErrorModule} from '../api-error/api-error.module';
import {SocketTestingModule} from '../testing/socket-testing.module';
import {GamesService} from '../service/games.service';
import {StorageModule} from '../storage/storage.module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateTestingModule,
        SocketTestingModule,
        RouterTestingModule,
        ApiErrorModule,
        StorageModule,
      ],
      declarations: [
        HomeComponent,
      ],
      providers: [
        GamesService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
