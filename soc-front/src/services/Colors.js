export class ColorsService {
    static colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
      orange: '\x1b[38;5;208m'
    };
  
    //Impriume un solo mensaje con un color específico
    static print(message, color = 'reset') {
      const colorCode = this.colors[color.toLowerCase()];
      if (!colorCode) {
        console.error(`Color no soportado: ${color}. Colores soportados: ${Object.keys(this.colors).join(', ')}`);
        return;
      }
      console.log(colorCode + message + this.colors.reset);
    }
  
    //Imprime multiples mensajes con un color específico
    static log(color = 'reset', ...messages) {
      const colorCode = this.colors[color.toLowerCase()];
      if (!colorCode) {
        console.error(`Color no soportado: ${color}. Colores soportados: ${Object.keys(this.colors).join(', ')}`);
        return;
      }
      console.log(colorCode, ...messages, this.colors.reset);
    }
  }
  
  export default ColorsService; 