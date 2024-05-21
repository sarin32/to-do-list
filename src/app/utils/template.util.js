import { compile } from 'handlebars';
import { promises as fs } from 'fs';

export async function generateTemplate(templateName, data) {
  const templateContent = await fs.readFile(`./src/assets/templates/${templateName}.html`, 'utf-8');
  const template = compile(templateContent);
  return template(data);
}
