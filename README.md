# rollingpaper
온라인 롤링페이퍼

## What I want
- 사용자가 롤링페이퍼 사이트에 가입하면, 롤링페이퍼를 생성할 수 있다. 나의 롤링페이퍼를 직접 생성할 수도 있고, 타인에게 줄 롤링페이퍼를 생성할 수 있다.
    - 롤링페이퍼 당 고유번호를 부과해 URL로 뿌려 타인이 작성할 수 있게 한다.
    - 친구에게 줄 롤링페이퍼의 경우, 친구의 이메일을 입력하게 하여 롤링페이퍼를 전송할 수 있게 한다. 친구가 회원가입을 하면 해당 롤링페이퍼에 대한 권한을 가지게 되고, 해당 롤링페이퍼를 만든 사용자는 권한을 잃는다.
- 롤링페이퍼 내 게시글
    - 각각 고유번호를 가진다
    - 롤링페이퍼 주인만이 게시글을 삭제할 수 있다
    - 게시글에 필터링을 넣는다. 욕설 등을 차단할 수 있다.

## front-end
- 메인 페이지
    - 로그인 한 경우: 내 롤링페이퍼 목록, 롤링페이퍼 만들기 버튼
    - 로그인 안 한 경우: 로그인 창(로그인, 회원가입 버튼)
- 회원가입 페이지
- 롤링페이퍼 페이지
    - 롤링페이퍼 고유 URL 복사하는 버튼
    - 롤링페이퍼 게시글
    - 롤링페이퍼 삭제 버튼
    - 롤링페이퍼 필터링 지정 버튼
    - (고유 URL로 들어온 경우) 게시글 작성하기 버튼

## back-end
- **Node.js + Express**
- routes
    - `GET /`: 로그인 창을 띄움. 로그인하면 `/:nickname`으로 리다이렉트.
        - `GET /:nickname`: 로그인창 내리고, 사용자의 롤링페이퍼를 보여줌
    - `GET /join`: 회원가입 페이지를 보여줌
        - `POST /join`: 회원가입 진행. 데베에 사용자 정보 저장.
    - `GET /:nickname/rollingpaper`: 내 롤링페이퍼 목록을 보여줌
        - `GET /:nickname/rollingpaper/new`: 새로운 롤링페이퍼 만들기 창
        - `POST /:nickname/rollingpaper/new/`: 고유 id를 가진 롤링페이퍼를 만든다. (id와 친구에게 보내는 경우의 이메일 전송)
        - `GET /:nickname/rollingpaper/:id`: 해당 id를 가진 롤링페이퍼를 보여줌
            - `GET /:nickname/rollingpaper/:id/:post_id`: 해당 롤링페이퍼의 특정 게시글
            - `POST /:nickname/rollingpaper/:id?filter={필터링 단어}`: 필터링 단어 추가
            - `POST /:nickname/rollingpaper/:id?delete={게시글 id}`: 게시글 삭제
        - `GET /:nickname/rollingpaper/:id?edit=true`: 해당 URL로 들어온 경우, 게시글 쓰기 가능
            - `POST /:nickname/rollingpaper/:id?edit=true`: 게시글 작성. (게시글 고유 번호와 내용 전송)

- 데이터베이스: **MySQL**
    - 사용자 정보: 닉네임(고유), 이메일(고유), 비밀번호, (foreign key) 내 롤링페이퍼 id, (foreign key) 친구에게 줄 롤링페이퍼 id
    - 롤링페이퍼 정보: 롤링페이퍼 고유 id, (친구에게 주는 경우) 친구 이메일
    - 게시글 정보: 내용, 게시글 고유 id, (foreign key) 연결된 롤링페이퍼 id

- 회원가입/로그인 기능: **passport 라이브러리** 사용
    - 로컬 로그인
    - 카카오톡 로그인
    - 트위터 로그인
    - 페이스북 로그인
    - 로그인 할 때마다 내게 온 롤링페이퍼 있는지 확인
        - 있으면, 보낸 친구에게서 롤링페이퍼 삭제하고 내게로 옮기기
