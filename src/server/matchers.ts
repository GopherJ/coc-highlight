import Color from 'color'
import webColors from 'color-name'
import { Color as VSColor, ColorInformation, Range, TextDocument } from 'vscode-languageserver'

const names = Object.keys(webColors)
const colorHex = /\b(?:#)[0-9a-f]{8}|(?:#)[0-9a-f]{6}|(?:#)[0-9a-f]{4}|(?:#)[0-9a-f]{3}\b/ig
const colorFunctions = /\b((rgb|hsl)a?\([\d]{1,3}%?,\s*[\d]{1,3}%?,\s*[\d]{1,3}%?(,\s*\d?\.?\d+)?\))\b/gi
const colorHwb = /\b((hwb)\(\d+,\s*(100|0*\d{1,2})%,\s*(100|0*\d{1,2})%(,\s*0?\.?\d+)?\))\b/gi

export function getNameColor(word: string): VSColor | null {
  if (names.indexOf(word) == -1) return null
  let c = new Color(word)
  return { red: c.red() / 255, green: c.green() / 255, blue: c.blue() / 255, alpha: 1 }
}

export function findColorHex(document: TextDocument): ColorInformation[] {
  return findColors(document, colorHex)
}

export function findColorFunctions(document: TextDocument): ColorInformation[] {
  return findColors(document, colorFunctions)
}

export function findHwb(document: TextDocument): ColorInformation[] {
  return findColors(document, colorHwb)
}

function findColors(document: TextDocument, regex: RegExp): ColorInformation[] {
  let text = document.getText()
  let match = regex.exec(text)
  let result: ColorInformation[] = []
  while (match !== null) {
    const start = match.index
    try {
      const c = new Color(match[0])
      result.push({
        color: { red: c.red() / 255, green: c.green() / 255, blue: c.blue() / 255, alpha: c.alpha() },
        range: Range.create(document.positionAt(start), document.positionAt(start + match[0].length))
      })
    } catch (e) {
      // noop
      console.error(e)
    }
    match = regex.exec(text)
  }
  return result
}
