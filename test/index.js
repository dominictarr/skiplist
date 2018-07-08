var deepEqual = require('assert').deepEqual
var ll = require('../')
var d = require('../debug')
ll.dump = d.dump
ll.all = d.all
ll.item = d.item
var tape = require('tape')

tape('simple', function (t) {
  var b = Buffer.alloc(1000)
  var c = ll.item(b, 10, [0])
  t.deepEqual(d.all(b), [])
  t.end()
})

tape('increasing items', function (t) {
  var b = Buffer.alloc(10*1024)
  var c = ll.item(b, 0, [0, 0, 0, 0, 0, 0, 0])
  var a = [1,2,3,4,5]
  var _a = []
  a.forEach(function (v) {
    _a.push(v)
    ll.insert(b, c, v)
    try {
      deepEqual(ll.all(b), _a.sort(function (a,b) { return a - b }))
    } catch (err) {
      console.log(ll.dump(b))
      throw err
    }
  })
  t.deepEqual(ll.all(b), a)
  t.end()
})

tape('decreasing items', function (t) {
  var b = Buffer.alloc(10*1024)
  var c = ll.item(b, 0, [0, 0, 0, 0, 0, 0, 0])
  var a = [1,2,3,4,5]
  var _a = []
  a.slice().reverse().forEach(function (v) {
    _a.push(v)
    ll.insert(b, c, v)
    try {
      deepEqual(ll.all(b), _a.sort(function (a,b) { return a - b }))
    } catch (err) {
      console.log(ll.dump(b))
      throw err
    }
  })
  t.deepEqual(ll.all(b), a)
  t.end()
})

tape('random items', function (t) {

  for(var j = 0; j < 10; j++) {
    var b = Buffer.alloc(100*1024)
    var c = ll.item(b, 0, [0, 0, 0, 0, 0, 0])
    var a = []
    for(var i = 0; i < 50; i++) {
      var d = ll.dump(b)
      var s = b.toString('hex', 0, b.readUInt32LE(0))
      var v = ~~(1000*Math.random())
      a.push(v)
      ll.insert(b, c, v)
      try {
        deepEqual(ll.all(b), a.slice().sort(function (a, b) { return a - b }))
        t.deepEqual(ll.all(b), a.slice().sort(function (a, b) { return a - b }))
        a.forEach(function (v) {
          //searching for an exact value always returns the pointer to that value.
          var p = ll.find(b, c, v)
          t.equal(b.readUInt32LE(p), v)
        })
      }
      catch (err) {
        console.log("PRE", d)
        console.log("POST", ll.dump(b))
        console.log(ll.all(b))
        console.log(s, v)
        throw err
      }
    }
  }

  t.end()
})

var crypto = require('crypto')
tape('random strings', function (t) {
  var b = Buffer.alloc(100*1024)
  var c = ll.item(b, 0, [0, 0, 0, 0, 0, 0])
  var map = {}
  for(var i = 0; i < 100; i++) {
    var str = crypto.randomBytes(5 + ~~(Math.random()*10)).toString('hex')
    console.log("INSERT", str)
    var x = ll.insertString(b, c, str)
    map[str] = x
    console.log(x, ll.findString(b, c, str))
  }
  for(var k in map) {
    t.equal(ll.findString(b, c, k), map[k])
    t.equal(ll.getString(b, ll.findString(b, c, k)), k)
  }
  t.end()

})




















