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
};
const { serializable, unserializable } = splitUnserializableParts(fixture);

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
