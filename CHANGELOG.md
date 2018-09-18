# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.12"></a>
## [1.0.12](https://github.com/tmcw/docbox/compare/v1.0.11...v1.0.12) (2018-09-18)


### Bug Fixes

* **package:** update brfs to version 2.0.0 ([#90](https://github.com/tmcw/docbox/issues/90)) ([f15114b](https://github.com/tmcw/docbox/commit/f15114b))
* **package:** update cssnano to version 4.0.4 ([#96](https://github.com/tmcw/docbox/issues/96)) ([735fb63](https://github.com/tmcw/docbox/commit/735fb63)), closes [#93](https://github.com/tmcw/docbox/issues/93)



<a name="1.0.11"></a>
## [1.0.11](https://github.com/tmcw/docbox/compare/v1.0.10...v1.0.11) (2018-06-04)



<a name="1.0.10"></a>
## [1.0.10](https://github.com/tmcw/docbox/compare/v1.0.9...v1.0.10) (2018-06-03)


### Bug Fixes

* **package:** update browserify to version 16.0.0 ([#73](https://github.com/tmcw/docbox/issues/73)) ([d8aacd7](https://github.com/tmcw/docbox/commit/d8aacd7))
* **package:** update eslint-plugin-babel to version 5.0.0 ([#80](https://github.com/tmcw/docbox/issues/80)) ([aa4b2ee](https://github.com/tmcw/docbox/commit/aa4b2ee))
* Use cross-env to enable Windows + non-cygwin environments to build ([511bc62](https://github.com/tmcw/docbox/commit/511bc62)), closes [#86](https://github.com/tmcw/docbox/issues/86)



<a name="1.0.9"></a>
## [1.0.9](https://github.com/tmcw/docbox/compare/v1.0.8...v1.0.9) (2018-01-09)


### Bug Fixes

* Use property initializer syntax to capture proper 'this' context ([45ac20a](https://github.com/tmcw/docbox/commit/45ac20a))
* **package:** update browserify to version 15.0.0 ([#63](https://github.com/tmcw/docbox/issues/63)) ([ef939c4](https://github.com/tmcw/docbox/commit/ef939c4))
* **package:** update remark-html to version 7.0.0 ([#60](https://github.com/tmcw/docbox/issues/60)) ([e099b25](https://github.com/tmcw/docbox/commit/e099b25))
* **package:** update remark-slug to version 5.0.0 ([#61](https://github.com/tmcw/docbox/issues/61)) ([3c281b3](https://github.com/tmcw/docbox/commit/3c281b3))



<a name="1.0.8"></a>
## [1.0.8](https://github.com/tmcw/docbox/compare/v1.0.7...v1.0.8) (2017-09-20)


### Bug Fixes

* **package:** update babel-eslint to version 8.0.0 ([e351f42](https://github.com/tmcw/docbox/commit/e351f42))



<a name="1.0.7"></a>
## [1.0.7](https://github.com/tmcw/docbox/compare/v1.0.6...v1.0.7) (2017-08-01)


### Bug Fixes

* **package:** update eslint to version 4.1.0 ([e2838e6](https://github.com/tmcw/docbox/commit/e2838e6))
* **package:** update remark to version 8.0.0 ([f19be9c](https://github.com/tmcw/docbox/commit/f19be9c))



<a name="1.0.6"></a>
## [1.0.6](https://github.com/tmcw/docbox/compare/v1.0.5...v1.0.6) (2017-05-11)


### Bug Fixes

* **package:** update eslint-plugin-react to version 7.0.0 ([5657bb2](https://github.com/tmcw/docbox/commit/5657bb2))
* **readme:** Correct demo location ([f118de4](https://github.com/tmcw/docbox/commit/f118de4)), closes [#25](https://github.com/tmcw/docbox/issues/25)



<a name="1.0.5"></a>
## [1.0.5](https://github.com/tmcw/docbox/compare/v1.0.4...v1.0.5) (2017-03-18)


### Bug Fixes

* **css:** Fix styling of strong, em, and other inlines (#24) ([c4fefeb](https://github.com/tmcw/docbox/commit/c4fefeb)), closes [#24](https://github.com/tmcw/docbox/issues/24) [#23](https://github.com/tmcw/docbox/issues/23)

<a name="1.0.4"></a>
## [1.0.4](https://github.com/mapbox/docbox/compare/v1.0.3...v1.0.4) (2017-01-25)



<a name="1.0.3"></a>
## [1.0.3](https://github.com/mapbox/docbox/compare/v1.0.2...v1.0.3) (2017-01-25)



### March 22, 2016

* Fixes non-unique IDs on section headers.
* You can now run `npm run build` multiple times without any problems.

### March 17, 2016

* Support for linking to specific languages. URLs were previously like
  `#the-section` but now are `?language=JavaScript#the-section` when a language
  is selected, so that you can link to both a specific section and a specific
  language.
* Changes how Docbox uses highlight.js - instead of including tons and tons
  of languages, we include only a few.

### March 14, 2016

* Support for toggling between 1 and 2 column mode
