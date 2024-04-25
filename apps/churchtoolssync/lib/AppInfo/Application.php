<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Sören Liebich <soeren.liebich@gmail.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\ChurchToolsSync\AppInfo;

use OCP\AppFramework\App;

class Application extends App {
	public const APP_ID = 'churchtoolssync';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}
}
