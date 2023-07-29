export function calculateRandomValueBetween(min=0, max=5){
  return Math.round(Math.random() * (max - min) + min);
}