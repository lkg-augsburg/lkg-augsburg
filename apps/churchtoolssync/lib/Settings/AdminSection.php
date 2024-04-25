<?php
namespace OCA\ChurchToolsSync\Settings;

use OCP\IL10N;
use OCP\Settings\IIconSection;

/**
 * Summary of AdminSection
 */
class AdminSection implements IIconSection {

        /**
         * @var IURLGenerator
         */
        protected IURLGenerator $urlGenerator;

        /**
         * @var IL10N
         */
        protected IL10N $localisation;

        /**
         * Summary of __construct
         * @param \OCP\IL10N $l
         * @param \OCA\ChurchToolsSync\Settings\IURLGenerator $urlGenerator
         */
        public function __construct(IL10N $l, IURLGenerator $urlGenerator) {
                $this->localisation = $l;
                $this->urlGenerator = $urlGenerator;
        }

        /**
         * returns the ID of the section. It is supposed to be a lower case string
         *
         * @returns string
         */
        public function getID() {
                return 'churchtoolssync'; //or a generic id if feasible
        }

        /**
         * returns the translated name as it should be displayed, e.g. 'LDAP / AD
         * integration'. Use the L10N service to translate it.
         *
         * @return string
         */
        public function getName() {
                return $this->localisation->t('ChurchTools Integration');
        }

        /**
         * @return int whether the form should be rather on the top or bottom of
         * the settings navigation. The sections are arranged in ascending order of
         * the priority values. It is required to return a value between 0 and 99.
         */
        public function getPriority() {
                return 80;
        }

        /**
         * @return The relative path to a an icon describing the section
         */
        public function getIcon() {
                return $this->urlGenerator->imagePath('churchtoolssync', 'CT-NC-Sync_Logo.svg.svg');
        }

}