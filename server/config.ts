import fs from 'fs';
import jsyaml from 'js-yaml';

const config = jsyaml.load(
	fs.readFileSync(__dirname + '/../../../../../config.yml', 'utf8')
);

export default config;

