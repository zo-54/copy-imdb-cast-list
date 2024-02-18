// ==UserScript==
// @name         List main cast
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  copy the main cast listed on the imdb page
// @author       You
// @match        https://www.imdb.com/title/*/fullcredits*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        const labelRows = $("table.cast_list tr .castlist_label")

        const els = labelRows.length === 1 ? $("table.cast_list td:nth-child(2)") : $("table.cast_list").find("tr .castlist_label").parent().last().prevAll().find("td:nth-child(2)")

        const list = els.text().replaceAll(/\s*\n\s*/g,'\n').trim()

        console.log(list)

        $(document).on('copy', (ev) => {
            const selection = window.getSelection()
            if (selection.type !== 'Range') {
                ev.preventDefault()

                navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
                    if (result.state === 'granted' || result.state === 'prompt') {
                        navigator.clipboard.writeText(list)

                        Array.from(els).forEach((el, i) => {
                            const mainEl = $(el)

                            const ogContents = mainEl.children()

                            const mainHeight = mainEl.height(), textHeight = mainEl.children().height()

                            const animationContainer = $(`<div style="height:${textHeight}px;transform:translateY(-${2 * (mainHeight + textHeight)}px);transition:transform 0.2s ease-in-out;"></div>`)

                            mainEl.children().appendTo(animationContainer)
                            mainEl.append(animationContainer)

                            mainEl.css("overflow", "hidden")

                            ogContents.clone().appendTo(animationContainer)
                            animationContainer.append(`<span style="display: block; height: ${textHeight}px; margin: ${mainHeight}px 0">Copied!</span>`)
                            ogContents.appendTo(animationContainer)

                            // Animate in
                            setTimeout(() => {
                                animationContainer.css('transform', `translateY(-${mainHeight + textHeight}px)`)
                            }, i * 15)

                            // Animate out
                            setTimeout(() => {
                                animationContainer.css('transform', `translateY(0)`)
                            }, 8 * 15 + 2500)

                            // Cleanup
                            setTimeout(() => {
                                ogContents.appendTo(mainEl)
                                animationContainer.remove()
                            }, 4000)
                        })
                    } else {
                        input(list)
                    }
                })
            }
        })
    })
})();