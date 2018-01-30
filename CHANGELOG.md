# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.7.3"></a>
## [0.7.3](https://github.com/deadwookie/yatk/compare/v0.7.2...v0.7.3) (2018-01-30)


### Bug Fixes

* **game:** tune up resize formula to add gaps ([3ca092b](https://github.com/deadwookie/yatk/commit/3ca092b))



<a name="0.7.2"></a>
## [0.7.2](https://github.com/deadwookie/yatk/compare/v0.7.1...v0.7.2) (2018-01-30)


### Bug Fixes

* **game:** restore "smart and hooky" mobile resize ([fb7063c](https://github.com/deadwookie/yatk/commit/fb7063c))



<a name="0.7.1"></a>
## [0.7.1](https://github.com/deadwookie/yatk/compare/v0.7.0...v0.7.1) (2018-01-30)


### Bug Fixes

* **board:** change world key to 'cube' ([ade72e6](https://github.com/deadwookie/yatk/commit/ade72e6))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/deadwookie/yatk/compare/v0.6.0...v0.7.0) (2018-01-29)


### Bug Fixes

* **board:** abort async sequence arrange on "New Game" or "Next Round" click ([c4d5c91](https://github.com/deadwookie/yatk/commit/c4d5c91))
* **board:** add `initialScore`and set it to zero ([0d0aeab](https://github.com/deadwookie/yatk/commit/0d0aeab))
* **board:** fix board behavior if cursor was moved out of the last stage ([5ff3177](https://github.com/deadwookie/yatk/commit/5ff3177))
* **board:** make win condition to be based on actual strain length ([3069679](https://github.com/deadwookie/yatk/commit/3069679))
* **board:** typings for strain ([c713d26](https://github.com/deadwookie/yatk/commit/c713d26))
* **cell:** simplify far cells distinction ([ca60baa](https://github.com/deadwookie/yatk/commit/ca60baa))
* **game:** simplify mobile-adaption ([493ac22](https://github.com/deadwookie/yatk/commit/493ac22))
* **matrix:** disable "Next Round" button for finished game ([4b07862](https://github.com/deadwookie/yatk/commit/4b07862))
* **matrix:** hide cursor when game's over ([ade8ae3](https://github.com/deadwookie/yatk/commit/ade8ae3))
* **matrix:** re-arrange buttons and info layout ([55789eb](https://github.com/deadwookie/yatk/commit/55789eb))
* **matrix:** remove text wrap on finish message ([fd65ece](https://github.com/deadwookie/yatk/commit/fd65ece))
* **matrix:** reorganize status info ([423aa26](https://github.com/deadwookie/yatk/commit/423aa26))
* **rules:** temporary disable row collapse ([ec9f14e](https://github.com/deadwookie/yatk/commit/ec9f14e))
* **theme:** improve text colors and fonts ([657d848](https://github.com/deadwookie/yatk/commit/657d848))


### Features

* initial cube implementation ([3ba08e5](https://github.com/deadwookie/yatk/commit/3ba08e5))
* **matrix:** add a separate cursor ([d87f018](https://github.com/deadwookie/yatk/commit/d87f018))
* **matrix:** add max stage and rest cells information ([db2bce8](https://github.com/deadwookie/yatk/commit/db2bce8))
* **matrix:** blur cells based on their depth ([b4b7081](https://github.com/deadwookie/yatk/commit/b4b7081))
* **matrix:** render overlay while board is processing next round ([75bd101](https://github.com/deadwookie/yatk/commit/75bd101))
* **matrix:** reorganize actions to prevent mis-clicking, and move info to keep consistency ([acd321e](https://github.com/deadwookie/yatk/commit/acd321e))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/deadwookie/yatk/compare/v0.5.0...v0.6.0) (2017-12-01)


### Features

* **settings:** separate settings for smaller screens ([893fbe8](https://github.com/deadwookie/yatk/commit/893fbe8))



<a name="0.5.0"></a>
# 0.5.0 (2017-11-30)


### Bug Fixes

* **actions:** game actions to match vue version ([1fa35ca](https://github.com/deadwookie/yatk/commit/1fa35ca))
* **board:** build spiral ([f26bec9](https://github.com/deadwookie/yatk/commit/f26bec9))
* **board:** collapse of the columns and rows to move only required entities ([3d550b3](https://github.com/deadwookie/yatk/commit/3d550b3))
* **board:** incorrect source hash used in collapse rows rules ([2b80a33](https://github.com/deadwookie/yatk/commit/2b80a33))
* use "Game Over" phrase instead of "You Lose" ([a18ac33](https://github.com/deadwookie/yatk/commit/a18ac33))
* **board:** rendering spiral ([b692cec](https://github.com/deadwookie/yatk/commit/b692cec))
* chain action unset sequence values ([14aef7b](https://github.com/deadwookie/yatk/commit/14aef7b))
* clear cell isChained on clear chain ([9d789af](https://github.com/deadwookie/yatk/commit/9d789af))
* is diagonal for multiple targets ([af60797](https://github.com/deadwookie/yatk/commit/af60797))
* match is diagonal cells ([877db7c](https://github.com/deadwookie/yatk/commit/877db7c))
* move cursor to previous logical postition during collapse ([1a9e739](https://github.com/deadwookie/yatk/commit/1a9e739))
* no empty element is allowed to chain ([41fde98](https://github.com/deadwookie/yatk/commit/41fde98))
* **finish:** update board on win or lose ([61584ec](https://github.com/deadwookie/yatk/commit/61584ec))
* reduce board size to work on mobile ([58fac2f](https://github.com/deadwookie/yatk/commit/58fac2f))
* remove from chain on cell second click ([c48db59](https://github.com/deadwookie/yatk/commit/c48db59))
* render cursor ([9354ec8](https://github.com/deadwookie/yatk/commit/9354ec8))
* set initial sequence length ([90a32fe](https://github.com/deadwookie/yatk/commit/90a32fe))
* slow new game render and move cursor ([3711e31](https://github.com/deadwookie/yatk/commit/3711e31))
* update round counter ([b723343](https://github.com/deadwookie/yatk/commit/b723343))
* use world, level, phase scheme for analytics events ([75e82d0](https://github.com/deadwookie/yatk/commit/75e82d0))
* **board:** revert removed method ([0d07cfa](https://github.com/deadwookie/yatk/commit/0d07cfa))
* **cell:** shine dead char ([8d4955d](https://github.com/deadwookie/yatk/commit/8d4955d))
* **css:** center game board ([60f1ac4](https://github.com/deadwookie/yatk/commit/60f1ac4))
* **header:** optimize logo animation ([b08feb6](https://github.com/deadwookie/yatk/commit/b08feb6))
* **html:** add initial viewport setup ([8f9a7d5](https://github.com/deadwookie/yatk/commit/8f9a7d5))
* **matrix:** optimize animations ([c5dabeb](https://github.com/deadwookie/yatk/commit/c5dabeb))
* **matrix:** remove unusued link to #faq ([f7edac3](https://github.com/deadwookie/yatk/commit/f7edac3))
* **matrix:** try to scale matrix to be responsive ([30a078d](https://github.com/deadwookie/yatk/commit/30a078d))
* **matrix:** update style of cursor and dead cell ([9e2d82b](https://github.com/deadwookie/yatk/commit/9e2d82b))
* **rain:** optimize blur effect ([c0dcd4b](https://github.com/deadwookie/yatk/commit/c0dcd4b))
* **rain:** set glyph's font-size to be the same as drop size ([9ad46a9](https://github.com/deadwookie/yatk/commit/9ad46a9))
* **rain:** support window/drop sizes update ([2ff49dc](https://github.com/deadwookie/yatk/commit/2ff49dc))
* **rain:** tune up styles ([50e5423](https://github.com/deadwookie/yatk/commit/50e5423))
* **seq:** count zero value seq items ([2612eb2](https://github.com/deadwookie/yatk/commit/2612eb2))
* **sequence:** show real filtered seq length ([be27435](https://github.com/deadwookie/yatk/commit/be27435))


### Features

* **rules:** make collapse rows or columns as optional rules ([34591bc](https://github.com/deadwookie/yatk/commit/34591bc))
* add GameAnalytics on start finish and next round ([3dbaa1e](https://github.com/deadwookie/yatk/commit/3dbaa1e))
* add rules for "end cursor" ([a7aadeb](https://github.com/deadwookie/yatk/commit/a7aadeb))
* add score from vue ([bf11234](https://github.com/deadwookie/yatk/commit/bf11234))
* add spiral seq max length ([3f67ea2](https://github.com/deadwookie/yatk/commit/3f67ea2))
* add to chain onclick action ([746f2ac](https://github.com/deadwookie/yatk/commit/746f2ac))
* add win message and moves count ([cf92095](https://github.com/deadwookie/yatk/commit/cf92095))
* delayed rendering of the sequecne arrange ([cde6aa8](https://github.com/deadwookie/yatk/commit/cde6aa8))
* game setup. WIP ([1f740a9](https://github.com/deadwookie/yatk/commit/1f740a9))
* **styles:** finish current styles ([4f001f5](https://github.com/deadwookie/yatk/commit/4f001f5))
* header component ([63fc9d7](https://github.com/deadwookie/yatk/commit/63fc9d7))
* **board:** collapse empty rows and columns ([d6ff95f](https://github.com/deadwookie/yatk/commit/d6ff95f))
* **board:** generate dummy game ([ed750b1](https://github.com/deadwookie/yatk/commit/ed750b1))
* **board:** remove from sequence collapsed elements ([682da72](https://github.com/deadwookie/yatk/commit/682da72))
* **controls:** add dis-gui components ([0d1c020](https://github.com/deadwookie/yatk/commit/0d1c020))
* **meter:** add simple fps-meter component, using stats.js ([45c81c6](https://github.com/deadwookie/yatk/commit/45c81c6))
* **rain:** add "pace" prop ([23b7565](https://github.com/deadwookie/yatk/commit/23b7565))
* **rain:** add blur effect when paused ([b147df5](https://github.com/deadwookie/yatk/commit/b147df5))
* **rain:** add gui to control raining ([fdf267c](https://github.com/deadwookie/yatk/commit/fdf267c))
* **rain:** make "pause on window blur" optional ([ee43f78](https://github.com/deadwookie/yatk/commit/ee43f78))
* **rain:** show fps meter while raining ([b2c8f38](https://github.com/deadwookie/yatk/commit/b2c8f38))
* **rain:** wip ([5ced9de](https://github.com/deadwookie/yatk/commit/5ced9de))
* **router:** basic hash router from react router dom ([604edd5](https://github.com/deadwookie/yatk/commit/604edd5))
* **seq:** add box geometry ([4ff5183](https://github.com/deadwookie/yatk/commit/4ff5183))
* **spiral:** build spiral coordinates for sequence elem ([326c847](https://github.com/deadwookie/yatk/commit/326c847))
* **styles:** initial styles rework ([d28ada8](https://github.com/deadwookie/yatk/commit/d28ada8))
* initial rules implementation. WIP ([df9ae35](https://github.com/deadwookie/yatk/commit/df9ae35))
* rendering of the board. WIP ([6726fad](https://github.com/deadwookie/yatk/commit/6726fad))
* rule that allows to congure collapse of the partial line (lines where cursor is located and cursor movement direction equals to line direction) ([a59207a](https://github.com/deadwookie/yatk/commit/a59207a))
* separate cell component from matrix ([926df1f](https://github.com/deadwookie/yatk/commit/926df1f))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/deadwookie/yatk/compare/v0.4.2...v0.4.3) (2017-11-29)


### Bug Fixes

* **matrix:** try to scale matrix to be responsive ([30a078d](https://github.com/deadwookie/yatk/commit/30a078d))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/deadwookie/yatk/compare/v0.4.1...v0.4.2) (2017-11-28)


### Bug Fixes

* **html:** add initial viewport setup ([8f9a7d5](https://github.com/deadwookie/yatk/commit/8f9a7d5))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/deadwookie/yatk/compare/v0.4.0...v0.4.1) (2017-11-28)



<a name="0.4.0"></a>
# 0.4.0 (2017-11-28)


### Bug Fixes

* **actions:** game actions to match vue version ([1fa35ca](https://github.com/deadwookie/yatk/commit/1fa35ca))
* **board:** build spiral ([f26bec9](https://github.com/deadwookie/yatk/commit/f26bec9))
* **board:** collapse of the columns and rows to move only required entities ([3d550b3](https://github.com/deadwookie/yatk/commit/3d550b3))
* **board:** incorrect source hash used in collapse rows rules ([2b80a33](https://github.com/deadwookie/yatk/commit/2b80a33))
* remove from chain on cell second click ([c48db59](https://github.com/deadwookie/yatk/commit/c48db59))
* **board:** rendering spiral ([b692cec](https://github.com/deadwookie/yatk/commit/b692cec))
* **board:** revert removed method ([0d07cfa](https://github.com/deadwookie/yatk/commit/0d07cfa))
* **cell:** shine dead char ([8d4955d](https://github.com/deadwookie/yatk/commit/8d4955d))
* **css:** center game board ([60f1ac4](https://github.com/deadwookie/yatk/commit/60f1ac4))
* **finish:** update board on win or lose ([61584ec](https://github.com/deadwookie/yatk/commit/61584ec))
* **header:** optimize logo animation ([b08feb6](https://github.com/deadwookie/yatk/commit/b08feb6))
* **matrix:** optimize animations ([c5dabeb](https://github.com/deadwookie/yatk/commit/c5dabeb))
* **matrix:** remove unusued link to #faq ([f7edac3](https://github.com/deadwookie/yatk/commit/f7edac3))
* **matrix:** update style of cursor and dead cell ([9e2d82b](https://github.com/deadwookie/yatk/commit/9e2d82b))
* use world, level, phase scheme for analytics events ([75e82d0](https://github.com/deadwookie/yatk/commit/75e82d0))
* **rain:** optimize blur effect ([c0dcd4b](https://github.com/deadwookie/yatk/commit/c0dcd4b))
* **rain:** set glyph's font-size to be the same as drop size ([9ad46a9](https://github.com/deadwookie/yatk/commit/9ad46a9))
* match is diagonal cells ([877db7c](https://github.com/deadwookie/yatk/commit/877db7c))
* **rain:** support window/drop sizes update ([2ff49dc](https://github.com/deadwookie/yatk/commit/2ff49dc))
* **rain:** tune up styles ([50e5423](https://github.com/deadwookie/yatk/commit/50e5423))
* **seq:** count zero value seq items ([2612eb2](https://github.com/deadwookie/yatk/commit/2612eb2))
* no empty element is allowed to chain ([41fde98](https://github.com/deadwookie/yatk/commit/41fde98))
* **sequence:** show real filtered seq length ([be27435](https://github.com/deadwookie/yatk/commit/be27435))
* chain action unset sequence values ([14aef7b](https://github.com/deadwookie/yatk/commit/14aef7b))
* clear cell isChained on clear chain ([9d789af](https://github.com/deadwookie/yatk/commit/9d789af))
* is diagonal for multiple targets ([af60797](https://github.com/deadwookie/yatk/commit/af60797))
* move cursor to previous logical postition during collapse ([1a9e739](https://github.com/deadwookie/yatk/commit/1a9e739))
* render cursor ([9354ec8](https://github.com/deadwookie/yatk/commit/9354ec8))
* set initial sequence length ([90a32fe](https://github.com/deadwookie/yatk/commit/90a32fe))
* slow new game render and move cursor ([3711e31](https://github.com/deadwookie/yatk/commit/3711e31))
* update round counter ([b723343](https://github.com/deadwookie/yatk/commit/b723343))
* use "Game Over" phrase instead of "You Lose" ([a18ac33](https://github.com/deadwookie/yatk/commit/a18ac33))


### Features

* **rules:** make collapse rows or columns as optional rules ([34591bc](https://github.com/deadwookie/yatk/commit/34591bc))
* add GameAnalytics on start finish and next round ([3dbaa1e](https://github.com/deadwookie/yatk/commit/3dbaa1e))
* add rules for "end cursor" ([a7aadeb](https://github.com/deadwookie/yatk/commit/a7aadeb))
* add score from vue ([bf11234](https://github.com/deadwookie/yatk/commit/bf11234))
* add spiral seq max length ([3f67ea2](https://github.com/deadwookie/yatk/commit/3f67ea2))
* add to chain onclick action ([746f2ac](https://github.com/deadwookie/yatk/commit/746f2ac))
* add win message and moves count ([cf92095](https://github.com/deadwookie/yatk/commit/cf92095))
* delayed rendering of the sequecne arrange ([cde6aa8](https://github.com/deadwookie/yatk/commit/cde6aa8))
* game setup. WIP ([1f740a9](https://github.com/deadwookie/yatk/commit/1f740a9))
* **styles:** finish current styles ([4f001f5](https://github.com/deadwookie/yatk/commit/4f001f5))
* header component ([63fc9d7](https://github.com/deadwookie/yatk/commit/63fc9d7))
* **board:** collapse empty rows and columns ([d6ff95f](https://github.com/deadwookie/yatk/commit/d6ff95f))
* **board:** generate dummy game ([ed750b1](https://github.com/deadwookie/yatk/commit/ed750b1))
* **board:** remove from sequence collapsed elements ([682da72](https://github.com/deadwookie/yatk/commit/682da72))
* **controls:** add dis-gui components ([0d1c020](https://github.com/deadwookie/yatk/commit/0d1c020))
* **meter:** add simple fps-meter component, using stats.js ([45c81c6](https://github.com/deadwookie/yatk/commit/45c81c6))
* **rain:** add "pace" prop ([23b7565](https://github.com/deadwookie/yatk/commit/23b7565))
* **rain:** add blur effect when paused ([b147df5](https://github.com/deadwookie/yatk/commit/b147df5))
* **rain:** add gui to control raining ([fdf267c](https://github.com/deadwookie/yatk/commit/fdf267c))
* **rain:** make "pause on window blur" optional ([ee43f78](https://github.com/deadwookie/yatk/commit/ee43f78))
* **rain:** show fps meter while raining ([b2c8f38](https://github.com/deadwookie/yatk/commit/b2c8f38))
* **rain:** wip ([5ced9de](https://github.com/deadwookie/yatk/commit/5ced9de))
* **router:** basic hash router from react router dom ([604edd5](https://github.com/deadwookie/yatk/commit/604edd5))
* **seq:** add box geometry ([4ff5183](https://github.com/deadwookie/yatk/commit/4ff5183))
* **spiral:** build spiral coordinates for sequence elem ([326c847](https://github.com/deadwookie/yatk/commit/326c847))
* **styles:** initial styles rework ([d28ada8](https://github.com/deadwookie/yatk/commit/d28ada8))
* initial rules implementation. WIP ([df9ae35](https://github.com/deadwookie/yatk/commit/df9ae35))
* rendering of the board. WIP ([6726fad](https://github.com/deadwookie/yatk/commit/6726fad))
* rule that allows to congure collapse of the partial line (lines where cursor is located and cursor movement direction equals to line direction) ([a59207a](https://github.com/deadwookie/yatk/commit/a59207a))
* separate cell component from matrix ([926df1f](https://github.com/deadwookie/yatk/commit/926df1f))
