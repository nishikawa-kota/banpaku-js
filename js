javascript:(function(){
      alert('スクリプト開始');

      var wheelchairWords = ['車いす', '車椅子', '車いす対応', '車いす使用者', '車いす専用'];
      var hiddenCount = 0;
      var clickCount = 0;

      function findAndHide() {
          // 様々な方法でイベント行を探す
          var allDivs = document.querySelectorAll('div[class*="search_item"], div[class*="item_row"], div[class*="result"] button');

          allDivs.forEach(function(elem) {
              // ボタン要素かその親要素を探す
              var button = elem.tagName === 'BUTTON' ? elem : elem.querySelector('button');
              if (!button) return;

              var text = button.textContent || button.innerText || '';

              // 車椅子関連をチェック（モンハンは除外）
              var hasWheelchair = wheelchairWords.some(function(word) {
                  return text.indexOf(word) !== -1;
              });

              var hasMonHun = text.indexOf('モンスターハンター') !== -1 || text.indexOf('モンハン') !== -1;

              if (hasWheelchair && !hasMonHun) {
                  // ボタンの親要素を非表示
                  var parent = button.closest('div[class*="row"]') || button.parentElement;
                  if (parent && parent.style.display !== 'none') {
                      parent.style.display = 'none';
                      hiddenCount++;
                  }
              }
          });

          if (hiddenCount > 0) {
              alert(hiddenCount + '件を非表示にしました');
          }
      }

      function clickMoreButton() {
          // もっと見るボタンを探す（複数の方法）
          var moreButton = null;

          // 方法1: テキストで探す
          var allButtons = document.querySelectorAll('button:not([disabled])');
          for (var i = 0; i < allButtons.length; i++) {
              var btn = allButtons[i];
              var btnText = btn.textContent || btn.innerText || '';
              if (btnText.indexOf('もっと見る') !== -1) {
                  moreButton = btn;
                  break;
              }
          }

          // 方法2: クラス名の部分一致
          if (!moreButton) {
              moreButton = document.querySelector('button[class*="more"]:not([disabled])');
          }

          if (moreButton) {
              clickCount++;
              alert('もっと見るボタン発見！クリック回数: ' + clickCount);

              // クリックイベントを複数の方法で試す
              try {
                  moreButton.click();
              } catch(e) {
                  var evt = document.createEvent('MouseEvents');
                  evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                  moreButton.dispatchEvent(evt);
              }

              // クリック後にフィルター実行
              setTimeout(function() {
                  findAndHide();
                  // 再度もっと見るを探す
                  setTimeout(clickMoreButton, 3000);
              }, 2000);
          } else {
              alert('もっと見るボタンが見つかりません');
          }
      }

      // デバッグ情報表示
      function showDebugInfo() {
          var searchResults = document.querySelector('div[class*="result"], div[class*="search"]');
          var buttonCount = document.querySelectorAll('button').length;
          alert('検索結果エリア: ' + (searchResults ? 'あり' : 'なし') + '\nボタン総数: ' + buttonCount);
      }

      // 実行
      try {
          showDebugInfo();
          findAndHide();
          setTimeout(clickMoreButton, 1000);
      } catch(e) {
          alert('エラー: ' + e.message);
      }
  })();
