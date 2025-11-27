const transliterationMap: Readonly<Record<string, string>> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
  'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
  'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
}

const cyrillicVowels: ReadonlySet<string> = new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'])

const slugify = (input: string): string => {
  let output = ''

  const lowerCased = input.toLowerCase()
  const length = lowerCased.length

  const hasExceptionEnding = lowerCased.endsWith('ий') || lowerCased.endsWith('ый')

  for (let i = 0; i < length; i++) {
    const char = lowerCased[i]
    const prev = lowerCased[i - 1] ?? ''
    const next = lowerCased[i + 1] ?? ''

    if (char === 'ь' && next === 'и') {
      output += 'y'
      continue
    }

    if (char === 'е') {
      output += (i === 0 || cyrillicVowels.has(prev) || prev === 'ъ') ? 'ye' : 'e'
      continue
    }

    if (hasExceptionEnding && i === length - 2) {
      output += 'i';
      continue;
    }

    if (hasExceptionEnding && i === length - 1) {
      output += 'y';
      continue;
    }

    output += transliterationMap[char] ?? char
  }

  return output
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/[-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default slugify
