import {provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';
import {provideZonelessChangeDetection} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {ConfigTestingModule} from '../testing/config-testing.module';
import {SocketTestingModule} from '../testing/socket-testing.module';
import {translateTestingModule} from '../testing/translate-testing-module';
import {GameComponent} from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        GameComponent,
        translateTestingModule,
        RouterTestingModule,
        SocketTestingModule,
        ConfigTestingModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
