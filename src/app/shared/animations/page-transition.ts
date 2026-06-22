import { AnimationController, Animation } from '@ionic/angular';

/**
 * Custom iOS-style slide page transition.
 * Slides the entire page (header + content) as ONE unit from the right,
 * avoiding the default Ionic behavior of separately animating header
 * elements which causes visible "header delay" on back navigation.
 */
export function customPageTransition(_: HTMLElement, opts: any): Animation {
  const animationCtrl = new AnimationController();
  const DURATION = 280;
  const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)';

  const enteringPage = opts.enteringEl;
  const leavingPage = opts.leavingEl;
  const isGoingBack = opts.direction === 'back';

  let enteringAnimation: Animation;
  let leavingAnimation: Animation;

  if (isGoingBack) {
    // BACK navigation: entering page slides in from left, leaving slides out to right
    enteringAnimation = animationCtrl.create()
      .addElement(enteringPage)
      .duration(DURATION)
      .easing(EASING)
      .fromTo('transform', 'translateX(-30%)', 'translateX(0)')
      .fromTo('opacity', '0.85', '1');

    leavingAnimation = animationCtrl.create()
      .addElement(leavingPage)
      .duration(DURATION)
      .easing(EASING)
      .fromTo('transform', 'translateX(0)', 'translateX(100%)')
      .fromTo('opacity', '1', '0.9');
  } else {
    // FORWARD navigation: entering page slides in from right, leaving shifts left
    enteringAnimation = animationCtrl.create()
      .addElement(enteringPage)
      .duration(DURATION)
      .easing(EASING)
      .fromTo('transform', 'translateX(100%)', 'translateX(0)')
      .fromTo('opacity', '0.9', '1');

    leavingAnimation = animationCtrl.create()
      .addElement(leavingPage)
      .duration(DURATION)
      .easing(EASING)
      .fromTo('transform', 'translateX(0)', 'translateX(-30%)')
      .fromTo('opacity', '1', '0.85');
  }

  const rootAnimation = animationCtrl.create()
    .duration(DURATION)
    .easing(EASING)
    .addAnimation([enteringAnimation, leavingAnimation]);

  return rootAnimation;
}
