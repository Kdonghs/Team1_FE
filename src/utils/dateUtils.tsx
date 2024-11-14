// 한국 시간으로 변환하여 ISO 형식으로 반환
export const getKoreanTimeISO = (date: Date): string => {
  const koreanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  return koreanTime.toISOString();
};
