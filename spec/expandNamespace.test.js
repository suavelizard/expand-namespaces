const proxyquire = require( 'proxyquire' );

describe( 'The ./lib/expandNamespaces function', ()=>{

  it( 'should keep paths without namespaces unchanged', ()=>{

    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub()
    } );

    const expected = './somePath';
    const actual   = expandNamespaces( expected );

    expect( actual ).to.equal( actual );

  } );

  it( 'should prefix paths that have a namespace ', ()=>{
    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns({namespaces: {'foo': './bar'}})
    } );

    const callerPath = './projectPath';
    const actual   = expandNamespaces( `<foo>./somepath`, callerPath );
    expect( actual ).to.equal( '..\\bar\\somepath' );

  } );

  it( 'should resolve modules in the parent directory', ()=>{
    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns({namespaces: {'foo': '../bar'}})
    } );
    const callerPath = './projectPath';
    const actual   = expandNamespaces( `<foo>./somepath`, callerPath );    
    expect( actual ).to.equal( '..\\..\\bar\\somepath' );
  } );

  it( 'should resolve modules in a child directory', ()=>{
    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns({namespaces: {'foo': '../bar'}})
    } );
    const callerPath = './projectPath/fizz/buzz';
    const actual   = expandNamespaces( `<foo>./somepath`, callerPath );    
    expect( actual ).to.equal( '..\\..\\..\\..\\bar\\somepath' );
  } );

  it( 'should throw an error if the namespace doesn\'t exist', ()=>{
    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns({namespaces: {}})
    } );
    const callerPath = './projectPath';
    expect( ()=>{expandNamespaces( `<foo>./somepath`)} ).to.throw('namespace <foo> is not defined.');
  } );
  
  //  Some faling tests below. I believe it should manage to resolve these.
  it( 'should convert absolute to relative', ()=>{
    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub().returns({namespaces:{'foo': './bar'}})
    } );
    const callerPath = 'C://Users/projectPath';
    const actual   = expandNamespaces( `<foo>/somepath`, callerPath);
    expect( actual ).to.equal('./\\bar\\somepath');
  } );

  it( 'should always return a relative path', ()=>{
    const expandNamespaces = proxyquire( '../lib/expandNamespace', {
      './loadNamespaces': sinon.stub()
    } );
    const actual   = expandNamespaces( '.', '.' );
    expect( actual ).to.equal( './' );
  } );

} );
