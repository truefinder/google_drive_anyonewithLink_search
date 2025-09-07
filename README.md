# anyoneWithLink_GoogleDriveSearch
Googleドライブからリンクがあれば誰でも見れるファイルを探し出してくれるGoogle App Script


## 機能

- Google Drive 上の特定フォルダーおよびフォルダーリストから"リンクを知っていれば誰でも見れる公開状態のファイル"をまとめてくれる機能
- 単体のフォルダーの中にある全てのファイル検索 OnlyOne()
- フォルダーリストを巡回してくれる AllRound()
- 結果をcsvにまとめてくれる
  

## INSTALL（インストール手順）

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. エディターに以下の3ファイルの内容をコピー  
   - `code.gs`
   - `appsscript.gs`
   - `settings.gs`
4. メニューから **サービスを追加**  
   - `Drive API`　と `v3` を選択  
   - ID: `Drive`
5. settings.gs **フォルダー情報を設定**  
   - まとめて検知するなら FOLDER_LISTに情報を入力して
   - 実行する関数：`AllRound`
   - 単体で検知するなら FOLDER_LISTの一行目に情報を入れて、TARGET_FOLDERに FOLDER_LIST[0] を設定
   - 実行する関数：`OnlyOne`
   

## 注意事項

- Apps Script は自身の Google アカウントの権限で実行されます。必要な権限を許可してください。
- `Drive API` の有効化を忘れずに行ってください。
- `settings.gs` にある設定値 FOLDER_LISTは自分の環境に合わせて入力してください。

## 免責事項

このスクリプトは参考用です。実運用で使用する場合は、組織のセキュリティポリシーに基づきテスト・確認を行ってください。


