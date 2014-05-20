describe('basic', function () {
  var assert = require('assert');
  var nested = require('../');
  var source = {
    a: 1,
    b: {
      A: 'i',
      B: 'ii'
    },
    c: {
      A: {
        i: [ 'apples', 'bananas', 'coconuts' ],
        ii: [ 'ankles', 'bones', 'curly hair' ]
      },
      B: {
        i: [ 'waffles', 'pancakes' ],
        ii: [ 'movies', 'buttons', 'heart attacks' ]
      }
    }
  };

  it('can get nested a nested property', function () {
    assert.strictEqual(nested.get(source, 'a'), source.a);
    assert.strictEqual(nested.get(source, 'b.A'), source.b.A);
    assert.strictEqual(nested.get(source, 'c.A.i'), source.c.A.i);
  });
  it('can set nested a nested property', function () {
    var arr = [ 'apples', 'bananas', 'coconuts', 'donuts' ];
    nested.set(source, 'c.A.i', nested.get(source, 'c.A.i').concat(arr[3]));
    assert.strictEqual(nested.get(source, 'c.A.i').length, 4);
    for (var i in arr) {
      assert.strictEqual(nested.get(source, 'c.A.i')[i], arr[i]);
    }
  });
  it('can delete nested a nested property', function () {
    nested.delete(source, 'b.B');
    assert.strictEqual(source.b.A, 'i');
    assert.strictEqual(source.b.B, undefined);
  });
  it('can flatten a nested object', function () {
    var deep = { a: { b: [ 1, 2, 3, null ] } };
    var flat = { 'a.b.0': 1,
                 'a.b.1': 2,
                 'a.b.2': 3,
                 'a.b.3': null };
    assert.deepEqual(nested.flatten(deep), flat);
  });
});