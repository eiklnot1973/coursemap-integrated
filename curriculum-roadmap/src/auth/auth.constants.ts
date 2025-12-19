export const ID_REGEX = /^[a-zA-Z0-9]+$/;
export const ID_ERROR_MSG = '아이디는 영문과 숫자만 포함해야 합니다.';
export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9]).*$/;
export const PASSWORD_ERROR_MSG = '비밀번호는 영문과 숫자를 모두 포함해야 합니다.';
export const MIN_PASSWORD_LEN = 8;
export const MIN_PASSWORD_ERROR_MSG = '비밀번호는 최소 8자 이상이어야 합니다.';
export const MAX_PASSWORD_LEN = 20;
export const MAX_PASSWORD_ERROR_MSG = '비밀번호는 최대 20자까지 가능합니다.';