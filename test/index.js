'use strict';

// Load modules

const Apiece = require('..');
const Code = require('code');
const Lab = require('lab');


// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;


describe('wrap()', () => {

    it('wraps end and each functions', (done) => {

        const results = [];
        const cb = Apiece.wrap({
            end: (err) => {

                expect(err).to.not.exist();
                expect(results).to.equal([1, 2]);
                done();
            },
            each: (item) => {

                results.push(item);
            }
        });

        cb.each(1);
        cb.each(2);
        cb();
    });

    it('wraps each without end functions', (done) => {

        const results = [];
        const cb = Apiece.wrap({
            each: (item) => {

                results.push(item);
            }
        });

        expect(() => {

            cb.each(1);
            cb.each(2);
            cb();
        }).to.not.throw();

        expect(results).to.equal([1, 2]);
        done();
    });

    it('wraps nothing', (done) => {

        expect(() => {

            const cb = Apiece.wrap();
            cb.each(1);
            cb();
        }).to.not.throw();

        done();
    });

    it('passes end error', (done) => {

        const results = [];
        const cb = Apiece.wrap({
            end: (err) => {

                expect(err).to.be.an.error('boom');
                expect(results).to.equal([1, 2]);
                done();
            },
            each: (item) => {

                results.push(item);
            }
        });

        cb.each(1);
        cb.each(2);
        cb(new Error('boom'));
    });

    it('wraps end without each function', (done) => {

        const cb = Apiece.wrap({
            end: (err, results) => {

                expect(err).to.not.exist();
                expect(results).to.equal([1, 2]);
                done();
            }
        });

        cb.each(1);
        cb.each(2);
        cb();
    });

    it('wraps simple callback', (done) => {

        const cb = Apiece.wrap((err, results) => {

            expect(err).to.not.exist();
            expect(results).to.equal([1, 2]);
            done();
        });

        cb.each(1);
        cb.each(2);
        cb();
    });

    it('reuses callback', (done) => {

        const cb1 = Apiece.wrap({
            end: (err, results) => {

                expect(err).to.not.exist();
                expect(results).to.equal([1, 2]);
                done();
            }
        });

        const cb2 = Apiece.wrap(cb1);
        expect(cb2).to.shallow.equal(cb1);
        cb2.each(1);
        cb2.each(2);
        cb2();
    });

    it('combined each and end results (single)', (done) => {

        const results = [];
        const cb = Apiece.wrap({
            end: (err) => {

                expect(err).to.not.exist();
                expect(results).to.equal([1, 2, 0]);
                done();
            },
            each: (item) => {

                results.push(item);
            }
        });

        cb.each(1);
        cb.each(2);
        cb(null, 0);
    });

    it('combined each and end results (array)', (done) => {

        const results = [];
        const cb = Apiece.wrap({
            end: (err) => {

                expect(err).to.not.exist();
                expect(results).to.equal([1, 2, 3, 4]);
                done();
            },
            each: (item) => {

                results.push(item);
            }
        });

        cb.each(1);
        cb.each(2);
        cb(null, [3, 4]);
    });

    it('combines results without each function', (done) => {

        const cb = Apiece.wrap({
            end: (err, results) => {

                expect(err).to.not.exist();
                expect(results).to.equal([1, 2, 3]);
                done();
            }
        });

        cb.each(1);
        cb.each(2);
        cb(null, 3);
    });

    it('errors on invalid end function', (done) => {

        expect(() => {

            Apiece.wrap({ end: 'not a function' });
        }).to.throw('Invalid end option');
        done();
    });

    it('errors on invalid each function', (done) => {

        expect(() => {

            Apiece.wrap({ each: 'not a function' });
        }).to.throw('Invalid each option');
        done();
    });

    it('errors on invalid options', (done) => {

        expect(() => {

            Apiece.wrap('not a function');
        }).to.throw('Invalid options object');
        done();
    });
});
