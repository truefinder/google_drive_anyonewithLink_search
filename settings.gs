/**
 * @typedef {Object} FolderInfo
 * @property {number} number - 選択番号
 * @property {string} name - フォルダーの名前
 * @property {string} id - Google ドライブのID
 */
const FOLDER_LIST = [
  { number: 0, name: 'ダミー名前', id: 'フォルダーID' },
  { number: 1, name: 'ダミー名前', id: 'フォルダーID' },
  { number: 2, name: 'ダミー名前', id: 'フォルダーID' },
  { number: 3, name: 'ダミー名前', id: 'フォルダーID' },
  { number: 4, name: 'ダミー名前', id: 'フォルダーID' },
];

/**
 * スクリプト全体で使用する設定
 * FOLDER_IDは selectFolderAndSetConfig() 関数を実行することで設定されます。
 */
const SETTINGS = {
  TARGET_FOLDER : FOLDER_LIST[0]
};
