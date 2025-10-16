// Lightweight toast helper rendering to the #toast-root portal.
// Usage: import { showToast } from './components/Toast';
// showToast({ message: 'Saved!', type: 'success', duration: 3000 });

const TYPE_STYLES = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-blue-600',
  warning: 'bg-yellow-600 text-gray-900',
};

export function showToast({ message, type = 'info', duration = 3000 } = {}) {
  try {
    const root = document.getElementById('toast-root');
    if (!root) {
      // Fallback: alert if portal root not found
      // eslint-disable-next-line no-alert
      alert(message);
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'toast-item pointer-events-auto mb-2';

    const base = TYPE_STYLES[type] || TYPE_STYLES.info;
    const el = document.createElement('div');
    el.className = `${base} text-white rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 transform transition-all duration-300 translate-y-2 opacity-0`;

    // Icon
    const icon = document.createElement('span');
    icon.className = 'mt-0.5';
    icon.innerHTML =
      type === 'success' ? '✔️' : type === 'error' ? '⚠️' : type === 'warning' ? '❗' : 'ℹ️';

    // Message
    const msg = document.createElement('div');
    msg.className = 'text-sm font-medium';
    msg.textContent = message || '';

    // Close button
    const close = document.createElement('button');
    close.setAttribute('type', 'button');
    close.setAttribute('aria-label', 'Close');
    close.className = 'ml-auto text-white/80 hover:text-white text-sm';
    close.innerHTML = '✕';

    close.onclick = () => remove(true);

    el.appendChild(icon);
    el.appendChild(msg);
    el.appendChild(close);
    wrapper.appendChild(el);
    root.appendChild(wrapper);

    // Enter animation
    requestAnimationFrame(() => {
      el.classList.remove('translate-y-2', 'opacity-0');
      el.classList.add('translate-y-0', 'opacity-100');
    });

    let timeoutId;

    const remove = (immediate = false) => {
      clearTimeout(timeoutId);
      if (immediate) {
        wrapper.remove();
        return;
      }
      el.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => wrapper.remove(), 200);
    };

    // Auto-dismiss
    timeoutId = setTimeout(() => remove(false), Math.max(1200, duration));

    return remove;
  } catch (e) {
    // Final fallback
    // eslint-disable-next-line no-console
    console.error('Toast error', e);
  }
}

export default { showToast };
