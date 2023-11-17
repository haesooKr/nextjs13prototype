1. NEXT에서 GET은 항상 Caching을 한 Response를 답하므로, 매번 다른 결과가 나와야하는 GET에 대해서는 따로 조치가 필요하다 (Notion참고)

2. Server-side Rendering일떄는 Client의 쿠키에 접근하지못하므로 알아둘 것. (/messages & /messages/admin 페이지 참고 - server -> client 순)

3. Zustand 사용 시, 한 페이지의 두개의 컴포넌트가 같은 데이터를 공유하고있을 때 하나가 업데이트되면 무한루프에빠져서 에러가 발생하는데, 그걸 막기위해 login 페이지에 useEffect를 사용했으니 나중에 같은 문제 생길 시 참고.

4. global.css에 flex layout 참고.

[] ReponseHandler 모두 적용 messages/management/page.tsx에 있음.
[] writePost를 포함한 로딩 화면 만들기 (https://velog.io/@jay/Next.js-13-master-course-loading-error-UI 참고)


