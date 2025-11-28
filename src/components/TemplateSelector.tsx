import React from 'react';
import { Check } from 'lucide-react';

export type InvoiceTemplate = 'modern' | 'classic' | 'minimal' | 'professional';

interface TemplateSelectorProps {
  selectedTemplate: InvoiceTemplate;
  onTemplateChange: (template: InvoiceTemplate) => void;
}

const templates = [
  {
    id: 'modern' as InvoiceTemplate,
    name: 'Modern',
    description: 'Tampilan premium dengan gaya dark mode yang elegan',
    preview: 'bg-slate-900',
    accent: 'bg-slate-900'
  },
  {
    id: 'professional' as InvoiceTemplate,
    name: 'Professional',
    description: 'Gaya korporat yang bersih dengan aksen biru terpercaya',
    preview: 'bg-blue-700',
    accent: 'bg-blue-700'
  },
  {
    id: 'classic' as InvoiceTemplate,
    name: 'Classic',
    description: 'Formal dan tradisional dengan font serif',
    preview: 'bg-white border-2 border-gray-800',
    accent: 'bg-gray-800'
  },
  {
    id: 'minimal' as InvoiceTemplate,
    name: 'Minimal',
    description: 'Sederhana dan fokus pada kejelasan konten',
    preview: 'bg-white border border-gray-200',
    accent: 'bg-black'
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onTemplateChange }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Pilih Template Invoice</label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
              }`}
            onClick={() => onTemplateChange(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
            )}

            <div className={`h-20 w-full rounded-md mb-3 ${template.preview} flex items-center justify-center`}>
              <div className="text-center">
                <div className={`h-2 w-16 ${template.accent} rounded mb-2 mx-auto`}></div>
                <div className="h-1 w-12 bg-gray-300 rounded mx-auto"></div>
              </div>
            </div>

            <h3 className="font-medium text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;