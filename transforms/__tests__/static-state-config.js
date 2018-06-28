const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'static-state-config');
defineTest(__dirname, 'static-state-config', null, 'static-state-config1');
