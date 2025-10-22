export function getReturnDatePlus7Days(): string {
  const now = new Date();
  now.setDate(now.getDate() + 7);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
  }
  

export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // mês começa do 0
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
  