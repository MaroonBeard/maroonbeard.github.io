/* ============================================
   FAQ - Accordion Behavior
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other items
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('open');
            });

            // Toggle current item
            item.classList.toggle('open', !isOpen);
        });
    });
});
