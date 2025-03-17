import { JSONSchema4 } from 'json-schema';

type ConfigItem = {
  name: string;
  description: string;
  default?: string;
};

export function flattenConfigSchema(
  properties: JSONSchema4['properties'] = {},
  prefixes: string[] = []
) {
  const items: ConfigItem[] = [];

  Object.keys(properties)
    .filter(key => !key.startsWith('$'))
    .filter(key => !['vite', 'webpack'].includes(key))
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      const value = properties[key];

      if (value.type === 'object' && value.properties) {
        items.push(
          ...flattenConfigSchema(value.properties, [...prefixes, key])
        );
      } else {
        const { description, defaultValue } = parseDesc(value.description);
        items.push({
          name: [...prefixes, key].join('.'),
          description,
          default: defaultValue,
        });
      }
    });

  return items;
}

// Parse description with format "This is a description. [default: foo]"
const descRegex = /^(.+?)( \[default: (.+?)\])?$/;

function parseDesc(description: string = '') {
  const match = description.match(descRegex);

  if (!match) return { description: '' };

  return {
    description: match[1],
    defaultValue: match[3],
  };
}
