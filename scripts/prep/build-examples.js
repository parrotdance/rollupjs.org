const fs = require( 'fs' );
const path = require( 'path' );
const { mkdirp } = require( './utils.js' );

const root = path.resolve( __dirname, '../..' );

const examples = fs.readdirSync( `${root}/examples` ).filter( file => file[0] !== '.' );

mkdirp( `${root}/public/examples` );

const summary = [];
examples.forEach( file => {
	const example = require( `${root}/examples/${file}/example.json` );
	example.modules = fs.readdirSync( `${root}/examples/${file}/modules` )
		.filter( mod => mod[0] !== '.' )
		.map( mod => {
			return {
				name: mod,
				code: fs.readFileSync( `${root}/examples/${file}/modules/${mod}`, 'utf-8' )
			};
		})
		.sort( ( a, b ) => {
			return a.name === 'main.js' ? -1 : b.name === 'main.js' ? 1 : ( a.name < b.name ? -1 : 1 );
		});

	fs.writeFileSync( `${root}/public/examples/${file}.json`, JSON.stringify( example ) );

	summary.push({
		id: file,
		title: example.title
	});
});

fs.writeFileSync( `${root}/shared/routes/Repl/examples.js`, `
// this file is auto-generated, don't edit it
export default ${JSON.stringify( summary )};
`.trim() );