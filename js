  javascript:(function() {
      'use strict';

      function initializeFilter() {
          try {
              console.log('🎯 万博イベントフィルター開始 (iPhone版)');

              let isProcessing = false;
              let clickCount = 0;
              let retryCount = 0;
              const maxRetries = 2;

              // 車椅子関連キーワード（モンハンは例外）
              const wheelchairKeywords = ['車いす', '車椅子', '車いす対応', '車いす使用者', '車いす専用', '車いす限定'];
              const exceptionKeywords = ['モンスターハンター', 'モンハン'];

              // イベント項目を除外する関数
              function filterWheelchairEvents() {
                  try {
                      const eventRows = document.querySelectorAll('.style_search_item_row__moqWC');
                      if (eventRows.length === 0) {
                          console.log('⚠️ イベント項目が見つかりません');
                          return 0;
                      }

                      let hiddenCount = 0;

                      eventRows.forEach(function(row) {
                          const titleElement = row.querySelector('.style_search_item_title__aePLg');
                          if (titleElement) {
                              const title = titleElement.textContent || '';

                              // 車椅子関連キーワードをチェック
                              let hasWheelchairKeyword = false;
                              for (let i = 0; i < wheelchairKeywords.length; i++) {
                                  if (title.indexOf(wheelchairKeywords[i]) !== -1) {
                                      hasWheelchairKeyword = true;
                                      break;
                                  }
                              }

                              // モンハン例外チェック
                              let isMonsterHunterException = false;
                              for (let i = 0; i < exceptionKeywords.length; i++) {
                                  if (title.indexOf(exceptionKeywords[i]) !== -1) {
                                      isMonsterHunterException = true;
                                      break;
                                  }
                              }

                              // 車椅子関連だが、モンハンでない場合は非表示
                              if (hasWheelchairKeyword && !isMonsterHunterException) {
                                  row.style.display = 'none';
                                  hiddenCount++;
                                  console.log('❌ 除外: ' + title);
                              } else if (hasWheelchairKeyword && isMonsterHunterException) {
                                  console.log('✅ 例外保持: ' + title);
                              }
                          }
                      });

                      console.log('🔍 ' + hiddenCount + '個の車椅子イベントを除外しました');
                      return hiddenCount;
                  } catch (e) {
                      console.error('フィルタリングエラー:', e);
                      return 0;
                  }
              }

              // もっと見るボタンをクリックする関数
              function clickMoreButton() {
                  if (isProcessing) {
                      console.log('⏳ 処理中のため待機...');
                      return;
                  }

                  try {
                      // 複数のセレクターを試す
                      const selectors = [
                          '.style_more_btn__ymb22:not([disabled])',
                          'button[class*="more_btn"]:not([disabled])',
                          'button:not([disabled])'
                      ];

                      let moreButton = null;
                      for (let i = 0; i < selectors.length; i++) {
                          const buttons = document.querySelectorAll(selectors[i]);
                          for (let j = 0; j < buttons.length; j++) {
                              const btn = buttons[j];
                              const text = btn.textContent || '';
                              if (text.indexOf('もっと見る') !== -1 && !btn.disabled) {
                                  moreButton = btn;
                                  break;
                              }
                          }
                          if (moreButton) break;
                      }

                      if (moreButton && !moreButton.disabled) {
                          isProcessing = true;
                          clickCount++;

                          console.log('🔄 ' + clickCount + '回目: もっと見るボタンを発見');

                          // iPhoneでのスクロール対応
                          const rect = moreButton.getBoundingClientRect();
                          window.scrollTo({
                              top: window.pageYOffset + rect.top - window.innerHeight / 2,
                              behavior: 'smooth'
                          });

                          setTimeout(function() {
                              try {
                                  // クリックイベントを発火
                                  const clickEvent = new MouseEvent('click', {
                                      view: window,
                                      bubbles: true,
                                      cancelable: true
                                  });
                                  moreButton.dispatchEvent(clickEvent);
                                  console.log('✅ クリック実行');

                                  // クリック後の処理
                                  setTimeout(function() {
                                      filterWheelchairEvents();
                                      isProcessing = false;

                                      // 5秒後に再度チェック
                                      setTimeout(clickMoreButton, 5000);
                                  }, 3000);

                              } catch (e) {
                                  console.error('クリックエラー:', e);
                                  isProcessing = false;
                              }
                          }, 1500);

                      } else {
                          console.log('🏁 もっと見るボタンが見つからないか無効です');
                          // 最終フィルタリング
                          filterWheelchairEvents();

                          // リトライ
                          if (retryCount < maxRetries) {
                              retryCount++;
                              console.log('🔄 リトライ ' + retryCount + '/' + maxRetries);
                              setTimeout(clickMoreButton, 5000);
                          }
                      }
                  } catch (e) {
                      console.error('ボタンクリックエラー:', e);
                      isProcessing = false;
                  }
              }

              // DOM変更監視（シンプル版）
              let observerTimer = null;
              function setupObserver() {
                  try {
                      const targetNode = document.querySelector('.style_form_result__GANIs') || document.body;

                      const observer = new MutationObserver(function(mutations) {
                          if (observerTimer) clearTimeout(observerTimer);
                          observerTimer = setTimeout(function() {
                              if (!isProcessing) {
                                  filterWheelchairEvents();
                              }
                          }, 1000);
                      });

                      observer.observe(targetNode, {
                          childList: true,
                          subtree: true
                      });

                      console.log('👀 DOM監視開始');
                  } catch (e) {
                      console.error('Observer設定エラー:', e);
                  }
              }

              // グローバル関数として登録
              window.forceClickMore = clickMoreButton;
              window.filterEvents = filterWheelchairEvents;

              console.log('🎮 使用方法:');
              console.log('- forceClickMore() : 手動でもっと見るクリック');
              console.log('- filterEvents() : 手動でフィルタリング実行');

              // 初期化を遅延実行
              console.log('⏳ 3秒後に開始します...');
              setTimeout(function() {
                  setupObserver();
                  filterWheelchairEvents();
                  clickMoreButton();
              }, 3000);

          } catch (e) {
              console.error('初期化エラー:', e);
              alert('エラーが発生しました: ' + e.message);
          }
      }

      // ページ読み込み完了後に実行
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
          initializeFilter();
      } else {
          document.addEventListener('DOMContentLoaded', initializeFilter);
          // バックアップとして5秒後にも実行
          setTimeout(initializeFilter, 5000);
      }
  })();
