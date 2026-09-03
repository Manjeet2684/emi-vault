function swatchColor(name: string): string {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 360
  return `hsl(${hash} 28% 52%)`
}

type VariantSelectorProps = {
  storages: string[]
  colors: string[]
  selectedStorage: string
  selectedColor: string
  onStorageChange: (storage: string) => void
  onColorChange: (color: string) => void
}

export function VariantSelector({
  storages,
  colors,
  selectedStorage,
  selectedColor,
  onStorageChange,
  onColorChange,
}: VariantSelectorProps) {
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-800">Storage</legend>
        <div className="flex flex-wrap gap-2">
          {storages.map((storage) => {
            const selected = storage === selectedStorage
            return (
              <button
                key={storage}
                type="button"
                aria-pressed={selected}
                onClick={() => onStorageChange(storage)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  selected
                    ? 'border-indigo-700 bg-indigo-700 text-white'
                    : 'border-slate-300 bg-white text-slate-900 hover:border-indigo-400'
                }`}
              >
                {storage}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-800">Color</legend>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => {
            const selected = color === selectedColor
            return (
              <button
                key={color}
                type="button"
                aria-pressed={selected}
                aria-label={color}
                title={color}
                onClick={() => onColorChange(color)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  selected
                    ? 'border-indigo-700 ring-2 ring-indigo-200'
                    : 'border-slate-300 hover:border-indigo-400'
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-slate-300"
                  style={{ backgroundColor: swatchColor(color) }}
                  aria-hidden="true"
                />
                {color}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}
