javascript:(function(){
      try {
          // 視覚的フィードバック用の通知表示
          function showNotification(message) {
              var div = document.createElement('div');
              div.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#333;color:white;padding:10px 
  20px;border-radius:5px;z-index:9999;font-size:14px;';
              div.textContent = message;
              document.body.appendChild(div);
              setTimeout(function() {
                  if (div.parentNode) div.parentNode.removeChild(div);
              }, 3000);
          }

          showNotification('フィルター開始');

          var count = 0;
          var wheelchairWords = ['車いす', '車椅子', '車いす対応', '車いす使用者', '車いす専用', '車いす限定'];
          var monsterHunter = ['モンスターハンター', 'モンハン'];

          // フィルター実行
          function doFilter() {
              var rows = document.querySelectorAll('.style_search_item_row__moqWC');
              var hidden = 0;

              for (var i = 0; i < rows.length; i++) {
                  var row = rows[i];
                  var titleEl = row.querySelector('.style_search_item_title__aePLg');

                  if (titleEl) {
                      var title = titleEl.textContent || '';
                      var hasWheelchair = false;
                      var isMonHun = false;

                      // 車椅子チェック
                      for (var j = 0; j < wheelchairWords.length; j++) {
                          if (title.indexOf(wheelchairWords[j]) !== -1) {
                              hasWheelchair = true;
                              break;
                          }
                      }

                      // モンハンチェック
                      for (var k = 0; k < monsterHunter.length; k++) {
                          if (title.indexOf(monsterHunter[k]) !== -1) {
                              isMonHun = true;
                              break;
                          }
                      }

                      // 車椅子あり＆モンハンなし＝非表示
                      if (hasWheelchair && !isMonHun) {
                          row.style.display = 'none';
                          hidden++;
                      }
                  }
              }

              if (hidden > 0) {
                  showNotification(hidden + '件を非表示にしました');
              }
              return hidden;
          }

          // もっと見るクリック
          function clickMore() {
              var buttons = document.querySelectorAll('button');
              var moreBtn = null;

              for (var i = 0; i < buttons.length; i++) {
                  var btn = buttons[i];
                  if (!btn.disabled && btn.textContent && btn.textContent.indexOf('もっと見る') !== -1) {
                      moreBtn = btn;
                      break;
                  }
              }

              if (moreBtn) {
                  count++;
                  showNotification('もっと見る ' + count + '回目');
                  moreBtn.click();

                  // クリック後にフィルター実行
                  setTimeout(function() {
                      doFilter();
                      // 次のクリックを予約
                      setTimeout(clickMore, 4000);
                  }, 2000);
              } else {
                  showNotification('完了');
                  doFilter();
              }
          }

          // 開始
          setTimeout(function() {
              doFilter();
              clickMore();
          }, 1000);

      } catch (e) {
          alert('エラー: ' + e.message);
      }
  })();
