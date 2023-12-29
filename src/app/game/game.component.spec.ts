import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ActivatedRoute} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {EMPTY} from 'rxjs';
import {ConfigTestingModule} from '../testing/config-testing.module';
import {SocketTestingModule} from '../testing/socket-testing.module';
import {TranslateTestingModule} from '../testing/translate-testing-module';
import {GameComponent} from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        GameComponent,
        HttpClientTestingModule,
        TranslateTestingModule,
        RouterTestingModule,
        SocketTestingModule,
        ConfigTestingModule,
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {paramMap: EMPTY}},
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
