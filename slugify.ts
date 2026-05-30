const transliterationMap: Readonly<Record<string, string>> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y',
  'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
  'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
}

const cyrillicVowels: ReadonlySet<string> = new Set([
  'а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я',
])

const slugify = (input: string): string => {
  if (!input) return ''

  let output = ''
  const lowerCased = input.toLowerCase()
  const length = lowerCased.length

  for (let i = 0; i < length; i++) {
    const char = lowerCased[i]
    const prev = lowerCased[i - 1] ?? ''
    const next = lowerCased[i + 1] ?? ''

    // 1. Окончания -ий и -ый на конце любого слова во фразе → iy
    // Если текущий символ 'и'/'ы', а следующий 'й' AND после 'й' нет других русских букв
    if ((char === 'и' || char === 'ы') && next === 'й') {
      const afterNext = lowerCased[i + 2] ?? ''
      const isEndOfWord = !/[а-яё]/.test(afterNext)

      if (isEndOfWord) {
        output += 'iy'
        i++ // Пропускаем 'й', так как обработали всю пару целиком
        continue
      }
    }

    // 2. Буква Ь перед И (в стыке ьи -> yi). Мягкий знак заменяется на 'y', а 'и' обработает мапа
    if (char === 'ь' && next === 'и') {
      output += 'y'
      continue
    }

    // 3. Е в начале слова, после гласной, Ь или Ъ → ye (в остальных случаях -> e)
    if (char === 'е') {
      const isYe = i === 0 || cyrillicVowels.has(prev) || prev === 'ь' || prev === 'ъ'
      
      output += isYe ? 'ye' : 'e'
      continue
    }

    // 4. Стандартная транслитерация по мапе. Если символа нет в мапе (латиница/цифры) — оставляем как есть
    output += transliterationMap[char] ?? char
  }

  // Финальное очищение строки и формирование валидного URL-slug
  return output
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default slugify
