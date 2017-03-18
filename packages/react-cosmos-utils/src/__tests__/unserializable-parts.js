import splitUnserializableParts from '../unserializable-parts';

const Fn = () => {};
const fixture = {
  nada: null,
  numero: 5,
  texto: 'Hola bombon',
  listaSimple: [1, 2, 3],
  listaComplejo: [1, 2, Fn],
  objetoSimple: {
    bueno: true,
  },
  objetoComplejo: {
    funcion: Fn,
  },
  expresionRegular: /buscar/,
  funcion: Fn,
  instancia: new Fn(),
  props: {
    nadaProp: null,
    numeroProp: 5,
    textoProp: 'Hola bombon',
    listaSimpleProp: [1, 2, 3],
    listaComplejoProp: [1, 2, Fn],
    objetoSimpleProp: {
      buenoProp: true,
    },
    objetoComplejoProp: {
      funcionProp: Fn,
    },
    expresionRegularProp: /buscar/,
    funcionProp: Fn,
    instanciaProp: new Fn(),
  }
};
const { serializable, unserializable } = splitUnserializableParts(fixture);

describe('for fields on root-level fixture', () => {
  test('finds null serializable', () => {
    expect(Object.keys(unserializable)).not.toContain('nada');
    expect(serializable.nada).toBe(fixture.nada);
  });

  test('finds number serializable', () => {
    expect(Object.keys(unserializable)).not.toContain('numero');
    expect(serializable.numero).toBe(fixture.numero);
  });

  test('finds string serializable', () => {
    expect(Object.keys(unserializable)).not.toContain('texto');
    expect(serializable.texto).toBe(fixture.texto);
  });

  test('finds simple list serializable', () => {
    expect(Object.keys(unserializable)).not.toContain('listaSimple');
    expect(serializable.listaSimple).toBe(fixture.listaSimple);
  });

  test('finds complex list unserializable', () => {
    expect(Object.keys(serializable)).not.toContain('listaComplejo');
    expect(unserializable.listaComplejo).toBe(fixture.listaComplejo);
  });

  test('finds simple object serializable', () => {
    expect(Object.keys(unserializable)).not.toContain('objetoSimple');
    expect(serializable.objetoSimple).toBe(fixture.objetoSimple);
  });

  test('finds complex object unserializable', () => {
    expect(Object.keys(serializable)).not.toContain('objetoComplejo');
    expect(unserializable.objetoComplejo).toBe(fixture.objetoComplejo);
  });

  test('finds regular expression unserializable', () => {
    expect(Object.keys(serializable)).not.toContain('expresionRegular');
    expect(unserializable.expresionRegular).toBe(fixture.expresionRegular);
  });

  test('finds function unserializable', () => {
    expect(Object.keys(serializable)).not.toContain('funcion');
    expect(unserializable.funcion).toBe(fixture.funcion);
  });

  test('finds instance unserializable', () => {
    expect(Object.keys(serializable)).not.toContain('instancia');
    expect(unserializable.instancia).toBe(fixture.instancia);
  });
});

describe('for fields on fixture.props', () => {
  test('finds null serializable', () => {
    expect(Object.keys(unserializable.props)).not.toContain('nadaProp');
    expect(serializable.props.nadaProp).toBe(fixture.props.nadaProp);
  });

  test('finds number serializable', () => {
    expect(Object.keys(unserializable.props)).not.toContain('numeroProp');
    expect(serializable.props.numeroProp).toBe(fixture.props.numeroProp);
  });

  test('finds string serializable', () => {
    expect(Object.keys(unserializable.props)).not.toContain('textoProp');
    expect(serializable.props.textoProp).toBe(fixture.props.textoProp);
  });

  test('finds simple list serializable', () => {
    expect(Object.keys(unserializable.props)).not.toContain('listaSimpleProp');
    expect(serializable.props.listaSimpleProp).toBe(fixture.props.listaSimpleProp);
  });

  test('finds complex list unserializable', () => {
    expect(Object.keys(serializable.props)).not.toContain('listaComplejoProp');
    expect(unserializable.props.listaComplejoProp).toBe(fixture.props.listaComplejoProp);
  });

  test('finds simple object serializable', () => {
    expect(Object.keys(unserializable.props)).not.toContain('objetoSimpleProp');
    expect(serializable.props.objetoSimpleProp).toBe(fixture.props.objetoSimpleProp);
  });

  test('finds complex object unserializable', () => {
    expect(Object.keys(serializable.props)).not.toContain('objetoComplejoProp');
    expect(unserializable.props.objetoComplejoProp).toBe(fixture.props.objetoComplejoProp);
  });

  test('finds regular expression unserializable', () => {
    expect(Object.keys(serializable.props)).not.toContain('expresionRegularProp');
    expect(unserializable.props.expresionRegularProp).toBe(fixture.props.expresionRegularProp);
  });

  test('finds function unserializable', () => {
    expect(Object.keys(serializable.props)).not.toContain('funcionProp');
    expect(unserializable.props.funcionProp).toBe(fixture.props.funcionProp);
  });

  test('finds instance unserializable', () => {
    expect(Object.keys(serializable.props)).not.toContain('instanciaProp');
    expect(unserializable.props.instanciaProp).toBe(fixture.props.instanciaProp);
  });
});
