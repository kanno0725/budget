## 家計簿アプリ
### 必要な機能
立て替え額の登録 →　登録画面
立て替え額の確認　→　履歴画面
清算　→　清算画面
ユーザー、購入品カテゴリ、などマスタの登録　→　設定画面

### 機能詳細
清算
グループすべてのユーザが均等に負担する

### 構成技術
フロント　React ts
アプリ化　PWA
バックエンド　nestjs + Prisma + fastly
DB　postgres

### DB構成
```plantuml
@startuml
entity users as "users\nユーザ" {
  + id [PK]
  --
  name [名前]
  login_id [ログインID]
  password [パスワード]
  user_group_id [所属ユーザーグループID]
  thema_color [テーマカラー]
  delete_flag [削除フラグ]
  created_at [作成日]
  updated_at [更新日]
}

entity user_groups as "user_groups\nユーザグループ" {
  + id [PK]
  --
  user_group_name [ユーザグループ名]
  delete_flag [削除フラグ]
  created_at [作成日]
  updated_at [更新日]
}

entity payments as "payments\n支払い履歴" {
  + id [PK]
  --
  name [支払い名]
  price [支払い金額]
  payment_datetime [支払い日時]
  payment_category_id [支払いカテゴリ]
'   user_group_name [ユーザグループ名]
  payment_user_id [支払いユーザー] 
'   デフォルトでログインユーザーが支払いユーザになる
  load_rate [負担割合]
  user_id [ユーザID]
  liquidated_flag [清算済みフラグ]
  delete_flag [削除フラグ]
  created_at [作成日]
  updated_at [更新日]
}

entity payment_categories as "payment_categories\n支払いカテゴリー" {
  + id [PK]
  --
  name [カテゴリー名]
  color [色]
  price [立て替え金額]
  delete_flag [削除フラグ]
  created_at [作成日]
  updated_at [更新日]
}

user_groups ||-d-o{ users
users ||-d-o{ payments
payment_categories ||-d-o{ payments
@enduml
```


