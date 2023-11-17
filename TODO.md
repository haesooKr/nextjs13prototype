[] 이미지 파일 uuid 생성 후, 저장
[] Post Notice Column 추가
[] 회원가입 승인절차 개발
[] selectedCommentContent처럼 부모->자식->부모->자식 계속 여러번 업데이트하는 문제 해결 필요



[] Home 리스트가 바로 업데이트되지않는 이슈 (서버컴포넌트에서 clinet로 바꿔야하나?)



[] Reponse Handler 모두 적용
[] 타입정리
[] quill patch (patch-package 사용법 정리)
[] localhost:3000 hard coding fix
                    /home/haesoo/code/next/psomagen/src/app/messages/page.tsx
                      6,16:   const url = "http://localhost:3000/api/unprotected/getMessage";

                    /home/haesoo/code/next/psomagen/src/app/post/[postId]/page.tsx
                      8,18:     const url = `http://localhost:3000/api/post/getPost?postId=${postId}`;

                    /home/haesoo/code/next/psomagen/src/app/page.tsx
                      6,16:   const url = "http://localhost:3000/api/unprotected/getPosts";

                    /home/haesoo/code/next/psomagen/robots.txt
                      5,10: Sitemap: http://localhost:3000/sitemap.xml

                    /home/haesoo/code/next/psomagen/sitemap.js
                      11,15:   addAnEntry("http://localhost:3000");
                      12,15:   addAnEntry("http://localhost:3000/posts");








  ----------- 완료 -----------
[v] middleware와 404 기본 not-found.tsx 사용못하는 이슈 -> 정상적인 방법은 아니지만 약간의 트릭을 이용해서 처리함
[v] uploadImage (image만 업로드할수있도록 수정)
[v] reactquill ctrl v하면 만들어지는 이미지 파일 업로드로 변환가능한지 확인!!!
[v] comment modify like delete 기능 추가
[v] selectedCommentContent가 [postId]페이지에서 모든 input들을 바꾸는 이슈 해결