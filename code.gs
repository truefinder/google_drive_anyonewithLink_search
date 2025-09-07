/**
 * Google Driveで特定のフォルダ配下の全てのファイルの中で
 * リンクがあるユーザーにアクセス可能なファイルを見つけてCSVで保存
 */


// *** 実行関数 OnlyOne
// setttings.gsで設定
// 
// const SETTINGS = {
//   TARGET_FOLDER : FOLDER_LIST[8] // <-- 　0~16 選ぶ
// };
// 
FOLDER = SETTINGS.TARGET_FOLDER ; 

function OnlyOne()
{
  console.log('OnlyOne 関数を開始します。全フォルダをスキャンします。');
  scanFolderForLinkSharedFiles(FOLDER) ;

  console.log('OnlyOne関数が完了しました。');

}

// *** 実行関数 AllRound
// setttings.gsに設定されたすべてのドライブを巡回
// 別途設定は必要ではない
function AllRound()
{
  console.log('AllRound関数を開始します。全フォルダをスキャンします。');
  
  for (let i = 0; i < FOLDER_LIST.length; i++) {
    const folder = FOLDER_LIST[i];
    console.log(`スキャン開始: ${folder.name} (ID: ${folder.id})`);
    
    try {
      scanFolderForLinkSharedFiles(folder);
      console.log(`スキャン完了: ${folder.name}`);
    } catch (error) {
      console.error(`エラー発生 - フォルダ: ${folder.name}, エラー: ${error.toString()}`);
    }
  }
  
  console.log('AllRound関数が完了しました。');

}


function scanFolderForLinkSharedFiles(folder) {
  
  folderId = folder.id; 
  folderName = folder.name; 

  // 結果を保存する配列
  let results = [];
  
  // CSVヘッダー
  results.push([
    'Created Date',
    'Modified Date',
    'File ID', 
    'File Name',
    'File URL',
    'File Type',
    'Sharing Status',
   
  ]);
  
  console.log('スキャン開始...');
  
  // フォルダ配下の全てのファイルをスキャン
  scanFolderRecursively(folderId, results);
  
  console.log(`合計 ${results.length - 1}個のリンク共有ファイルを発見しました。`);
  
  // CSVファイル生成
  createCSVFile(folderName, results);
  
  console.log('作業完了！');
}


/**
 * フォルダを再帰的にスキャンしてリンク共有されたファイルを見つけます
 */
function scanFolderRecursively(folderId, results) {
  let pageToken = '';

  
  
  do {
    // 現在のフォルダの全ての項目を取得（ファイル + フォルダ）
    const query = 'visibility = "anyoneWithLink" and trashed = false';
    
    const response = Drive.Files.list({
      q: query,
      pageSize: 1000,
      pageToken: pageToken,
      corpora : 'drive', 
      supportsAllDrives: true, 
      includeItemsFromAllDrives: true, 
      DriveId : folderId,
      // fields: 'nextPageToken, files(id, name, mimeType, owners, createdTime, modifiedTime, webViewLink, shared, permissions(id,emailAddress,role))'
      fields: 'nextPageToken, files(id, name, mimeType, parents, webViewLink, owners, createdTime,modifiedTime )'

    });

    if (response.files) {
          response.files.forEach(file => {
            // 重複チェック
            if (!results.some(f => f.id === file.id)) {
              results.push([
                new Date(file.createdTime).toLocaleString(),
                new Date(file.modifiedTime).toLocaleString(),
                file.id,
                file.name,
                file.webViewLink,
                file.mimeType,
               
                
                
                'Link Shared',
               
              ]
              );
            }
          });
        }
    /*
    if (response.files && response.files.length > 0) {
      for (let file of response.files) {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
          // フォルダの場合は再帰的にスキャン
          console.log(`フォルダスキャン中: ${file.name}`);
          scanFolderRecursively(file.id, results);
        } else {
          // ファイルの場合はリンク共有状態を確認
          checkFileForLinkSharing(file, results);
        }
      }
    }
    */
    
    pageToken = response.nextPageToken;
  } while (pageToken);

}

/**
 * ファイルのリンク共有状態を確認して結果に追加
 */
function checkFileForLinkSharing(file, results) {
  try {

      console.log(`リンク共有ファイル発見: ${file.name}`);
      
      // 所有者情報
      const owner = file.owners && file.owners.length > 0 ? file.owners[0].emailAddress : 'Unknown';
      
      // ファイル情報を結果に追加
      results.push([
        new Date(file.createdTime).toLocaleString(),
        new Date(file.modifiedTime).toLocaleString(),
        file.id,
        file.name,
        file.webViewLink,
        file.mimeType,
       
        
        'Link Shared',
       
      ]);
    
  } catch (error) {
    console.error(`ファイル権限確認中にエラー: ${file.name}`, error);
  }
}

/**
 * 結果をCSVファイルとして生成してGoogle Driveに保存
 */
function createCSVFile(folderName, data) {
  // CSV形式に変換
  const csvContent = data.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`)
       .join(',')
  ).join('\n');
  
  // 現在の日付/時間でファイル名生成
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
  const fileName = `${folderName}_PublicLinkShareList_${timestamp}.csv`;
  
  // CSVファイルをGoogle Driveに保存
  const blob = Utilities.newBlob(csvContent, 'text/csv', fileName);
  const file = DriveApp.createFile(blob);
  
  console.log(`CSVファイルが作成されました: ${fileName}`);
  console.log(`ファイルID: ${file.getId()}`);
  console.log(`ファイルURL: ${file.getUrl()}`);
  
  return file;
}

/**
 * 特定のフォルダのみをスキャンするシンプル版（再帰なし）
 */
function scanSingleFolder() {
  const FOLDER_ID = 'YOUR_FOLDER_ID_HERE'; // ここに実際のフォルダIDを入力
  
  let results = [];
  results.push([
    'Created Date',
    'Modified Date',
    'File ID', 
    'File Name',
    'File URL',
    'File Type',
    
    
    'Sharing Status',
    
  ]);
  
  let pageToken = '';
  
  do {
    const query = `'${FOLDER_ID}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`;
    
    const response = Drive.Files.list({
      q: query,
      pageSize: 1000,
      pageToken: pageToken,
      fields: 'nextPageToken, files(id, name, mimeType, owners, createdTime, modifiedTime, webViewLink, shared, permissions)'
    });
    
    if (response.files && response.files.length > 0) {
      for (let file of response.files) {
        checkFileForLinkSharing(file, results);
      }
    }
    
    pageToken = response.nextPageToken;
  } while (pageToken);
  
  createCSVFile(results);
  console.log(`作業完了！合計 ${results.length - 1}個のリンク共有ファイルを発見しました。`);
}

/**
 * フォルダIDを見つけるためのヘルパー関数
 */
function findFolderByName(folderName, parentFolderId = null) {
  let query = `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  
  if (parentFolderId) {
    query += ` and '${parentFolderId}' in parents`;
  }
  
  const response = Drive.Files.list({
    q: query,
    fields: 'files(id, name, parents)'
  });
  
  if (response.files && response.files.length > 0) {
    console.log(`フォルダ発見: ${response.files[0].name} (ID: ${response.files[0].id})`);
    return response.files[0].id;
  }
  
  console.log(`フォルダが見つかりません: ${folderName}`);
  return null;
}
