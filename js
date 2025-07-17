javascript:(function(){
      var retryCount = 0;
      var maxRetry = 30;
      var hiddenCount = 0;

      function waitAndStart() {
          // 検索結果の要素を探す
          var hasResults = document.querySelector('button[class*="search_item"], div[class*="search_item"], div[class*="result"]');

          if (!hasResults && retryCount < maxRetry) {
              retryCount++;
              setTimeout(waitAndStart, 500); // 0.5秒間隔でリトライ
              return;
          }

          if (hasResults) {
              alert('検索結果を発見！処理開始');
              startFiltering();
          } else {
              alert('検索結果が見つかりません（' + retryCount + '回試行）');
          }
      }

      function startFiltering() {
          var wheelchairWords = ['車いす', '車椅子', '車いす対応', '車いす使用者', '車いす専用'];

          // 500ms間隔で継続的に実行
          setInterval(function() {
              // イベント行を探す
              var allButtons = document.querySelectorAll('button');
              var filtered = 0;

              allButtons.forEach(function(btn) {
                  var text = btn.textContent || '';

                  // パビリオンやイベント名が含まれているボタンを対象
                  if (text.length > 10 && (text.indexOf('パビリオン') !== -1 || text.indexOf('館') !== -1 || text.length > 20)) {

                      var hasWheelchair = wheelchairWords.some(function(word) {
                          return text.indexOf(word) !== -1;
                      });

                      var hasMonHun = text.indexOf('モンスターハンター') !== -1 || text.indexOf('モンハン') !== -1;

                      if (hasWheelchair && !hasMonHun) {
                          var parent = btn.closest('div');
                          if (parent && parent.style.display !== 'none') {
                              parent.style.display = 'none';
                              filtered++;
                          }
                      }
                  }

                  // もっと見るボタンチェック
                  if (text === 'もっと見る' && !btn.disabled) {
                      btn.click();
                  }
              });

              if (filtered > 0) {
                  hiddenCount += filtered;
                  console.log(filtered + '件を非表示（合計: ' + hiddenCount + '件）');
              }
          }, 500);
      }

      // DOM読み込み完了後に開始
      if (document.readyState === 'complete') {
          setTimeout(waitAndStart, 1000);
      } else {
          window.addEventListener('load', function() {
              setTimeout(waitAndStart, 1000);
          });
      }
  })();
