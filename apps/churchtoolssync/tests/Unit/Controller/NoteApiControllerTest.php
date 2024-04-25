<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Sören Liebich <soeren.liebich@gmail.com>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\ChurchToolsSync\Tests\Unit\Controller;

use OCA\ChurchToolsSync\Controller\NoteApiController;

class NoteApiControllerTest extends NoteControllerTest {
	public function setUp(): void {
		parent::setUp();
		$this->controller = new NoteApiController($this->request, $this->service, $this->userId);
	}
}
