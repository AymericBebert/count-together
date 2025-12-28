import {simplifyURL} from './simplify-url';

describe('simplifyUrl', () => {

  it('simple case', () => {
    expect(simplifyURL(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('tricky case 1', () => {
    expect(simplifyURL(['a', 'b', '..', 'c', 'd', 'e', '..', '..', 'f'])).toEqual(['a', 'c', 'f']);
  });

  it('tricky case 2', () => {
    expect(simplifyURL(['a', 'b', '..', 'c', 'd', 'e', '..', 'f', '..', '..'])).toEqual(['a', 'c']);
  });

});
